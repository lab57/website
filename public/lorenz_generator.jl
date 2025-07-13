# lorenz_data_generator.jl
#
# Description:
# This script generates pre-computed particle tracks for the Lorenz attractor.
# It solves the Lorenz differential equations for multiple particles and saves
# the trajectories to a compact binary file.
#
# Dependencies:
# - DifferentialEquations.jl
# - StaticArrays.jl
#
# To Run:
# 1. Install Julia: https://julialang.org/downloads/
# 2. Open the Julia REPL.
# 3. Type `]` to enter Pkg mode.
# 4. `add DifferentialEquations`
# 5. `add StaticArrays`
# 6. Press Backspace to exit Pkg mode.
# 7. `include("lorenz_data_generator.jl")`

using DifferentialEquations
using StaticArrays

# Lorenz system parameters (must match JS visualization)
const σ = 10.0
const ρ = 28.0
const β = 8.0 / 3.0

# The Lorenz attractor equations, defined for use with DifferentialEquations.jl
# This is the "out-of-place" form, which is compatible with immutable SArrays.
# It takes the state `u` and returns a new SVector with the derivatives.
function lorenz(u, p, t)
    x, y, z = u
    dx = σ * (y - x)
    dy = x * (ρ - z) - y
    dz = x * y - β * z
    return SVector(dx, dy, dz)
end

# --- Simulation Parameters ---
const NUM_PARTICLES = 25
const DT = 0.00105 # Time step, corresponds to deltat in the original JS file
const T_END = 60.0  # Total simulation time. 60s @ 60fps gives > 15 mins of unique frames
const T_SPAN = (0.0, T_END)
const SAVE_TIMES = 0.0:DT:T_END
const NUM_TIME_STEPS = length(SAVE_TIMES)

# --- Generate Initial Conditions ---
# This function mimics the initialization logic from the original JS file
# to create a diverse set of starting points.
function get_initial_conditions(n)
    initial_conditions = []
    println("Generating initial conditions for $n particles...")
    for i in 1:n
        minR = 15 * (0.2 + rand())
        theta = rand() * 2 * π
        x0 = minR * cos(theta)
        y0 = minR * sin(theta)
        z0 = rand() * 30.0
        # Use SVector for better performance with DifferentialEquations.jl
        push!(initial_conditions, SVector(x0, y0, z0))
    end
    return initial_conditions
end

# --- Main Generation Logic ---
function generate_tracks()
    u0s = get_initial_conditions(NUM_PARTICLES)

    # This will hold all track data in a single, flat array for efficiency.
    # Format: [p1_t1_x, p1_t1_y, p1_t1_z, p2_t1_x, ... pN_t1_z, p1_t2_x, ...]
    all_tracks_flat = zeros(Float32, NUM_PARTICLES * NUM_TIME_STEPS * 3)

    println("Solving ODEs for each particle. This may take a moment...")
    for i in 1:NUM_PARTICLES
        if i % 5 == 0
            println("  Processing particle $i of $NUM_PARTICLES...")
        end

        # Use the out-of-place `lorenz` function, not `lorenz!`
        prob = ODEProblem(lorenz, u0s[i], T_SPAN)
        # Use a high-quality solver and save at our specified time steps.
        sol = solve(prob, Tsit5(), saveat=SAVE_TIMES)

        if sol.retcode != :Success || length(sol.t) != NUM_TIME_STEPS
            error("ODE solver failed or returned an incorrect number of steps for particle $i.")
        end

        # Interleave the results into the flat array for optimal read performance in JS.
        for j in 1:NUM_TIME_STEPS
            pos = sol.u[j]
            # Calculate the starting index in the flat array for this point in time.
            base_idx = ((j - 1) * NUM_PARTICLES + (i - 1)) * 3

            all_tracks_flat[base_idx+1] = Float32(pos[1])
            all_tracks_flat[base_idx+2] = Float32(pos[2])
            all_tracks_flat[base_idx+3] = Float32(pos[3])
        end
    end

    return all_tracks_flat
end

# --- Write Data to File ---
function write_to_binary_file(data, filename)
    println("\nWriting data to binary file: $filename")
    open(filename, "w") do f
        write(f, data)
    end
    file_size_mb = round(filesize(filename) / (1024^2), digits=2)
    println("✓ Successfully wrote $filename ($file_size_mb MB)")
    println("  - Data structure: Flat Float32 array, interleaved")
    println("  - Total particles: $NUM_PARTICLES")
    println("  - Time steps per particle: $NUM_TIME_STEPS")
    println("  - Total floats: $(length(data))")
end

# --- Run the script ---
function main()
    tracks_data = generate_tracks()
    write_to_binary_file(tracks_data, "lorenz_tracks.bin")
    println("\nGeneration complete.")
end

main()
