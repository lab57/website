# Filename: generate_lorenz_svg.jl
# Description: Solves the Lorenz system of differential equations and exports the
#              trajectory as an SVG path.
#
# To run this script, you first need to add the DifferentialEquations package.
# Open the Julia REPL and type:
# import Pkg
# Pkg.add("DifferentialEquations")

using DifferentialEquations

"""
    lorenz!(du, u, p, t)

Defines the Lorenz system of ordinary differential equations. This is the function
that the ODE solver will use to calculate the derivatives at each time step.

# Arguments
- `du`: The array to store the calculated derivatives (dx/dt, dy/dt, dz/dt).
- `u`: The current state vector [x, y, z].
- `p`: The parameters of the system [σ, ρ, β].
- `t`: The current time (not used in the Lorenz system as it's autonomous).
"""
function lorenz!(du, u, p, t)
    σ, ρ, β = p
    du[1] = σ * (u[2] - u[1])
    du[2] = u[1] * (ρ - u[3]) - u[2]
    du[3] = u[1] * u[2] - β * u[3]
end

"""
    generate_lorenz_svg(filepath="lorenz_attractor.svg")

Solves the Lorenz system and writes the resulting trajectory to an SVG file.
"""
function generate_lorenz_svg(filepath="lorenz_attractor.svg")
    # --- 1. Define the Problem ---
    # Set the parameters [σ, ρ, β] for the classic butterfly attractor
    params = [10.0, 28.0, 8 / 3]

    # Set the initial conditions [x₀, y₀, z₀]
    u0 = [1.0, 1.0, 1.0]

    # Define the time span for the simulation. A longer span gives a longer trace.
    tspan = (0.0, 1000.0)

    # Create the ODE problem object
    prob = ODEProblem(lorenz!, u0, tspan, params)

    # --- 2. Solve the ODE ---
    # We use the Tsit5() solver which is a good general-purpose choice.
    # `saveat=0.01` ensures we get points at regular time intervals for a smooth path.
    println("Solving the Lorenz system...")
    sol = solve(prob, Tsit5(), saveat=0.01)
    println("Solution found with $(length(sol.u)) points.")

    # --- 3. Process the Solution for SVG ---
    # We will project the 3D trajectory onto the 2D (x, z) plane for a classic view.
    points = [(pt[1], pt[3]) for pt in sol.u]

    # Define SVG dimensions and padding
    svg_width = 800
    svg_height = 600
    padding = 50

    # Find the bounds of the data to scale it to the SVG viewport
    x_min = minimum(p[1] for p in points)
    x_max = maximum(p[1] for p in points)
    z_min = minimum(p[2] for p in points)
    z_max = maximum(p[2] for p in points)

    # Function to scale and translate a point to SVG coordinates
    function scale_point(p)
        # Scale x to fit width minus padding on both sides
        x_scaled = (p[1] - x_min) / (x_max - x_min) * (svg_width - 2 * padding) + padding
        # Scale z to fit height minus padding, and flip the y-axis for SVG (0 is at the top)
        z_scaled = (z_max - p[2]) / (z_max - z_min) * (svg_height - 2 * padding) + padding
        return (x_scaled, z_scaled)
    end

    # --- 4. Generate the SVG Path Data ---
    # The path data is a string like "M x1,y1 L x2,y2 L x3,y3 ..."
    # M = MoveTo (starts a new subpath)
    # L = LineTo (draws a line from the current point to the new one)
    println("Generating SVG path data...")
    path_data = join(
        [
            (i == 1 ? "M" : "L") * # Use "M" for the first point, "L" for the rest
            "$(round(scale_point(p)[1], digits=2)),$(round(scale_point(p)[2], digits=2))"
            for (i, p) in enumerate(points)
        ],
        " "
    )

    # --- 5. Write to SVG File ---
    println("Writing to file: $(filepath)")
    open(filepath, "w") do f
        write(f, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
        write(f, "<svg width=\"$(svg_width)\" height=\"$(svg_height)\" viewBox=\"0 0 $(svg_width) $(svg_height)\" xmlns=\"http://www.w3.org/2000/svg\">\n")
        write(f, "  <style>\n")
        write(f, "    .lorenz-path {\n")
        write(f, "      fill: none;\n")
        write(f, "      stroke: #1e90ff;\n")
        write(f, "      stroke-width: 0.5;\n")
        write(f, "      stroke-opacity: 0.8;\n")
        write(f, "    }\n")
        write(f, "  </style>\n")
        write(f, "  <rect width=\"100%\" height=\"100%\" fill=\"#0d1117\"/>\n")
        write(f, "  <path class=\"lorenz-path\" d=\"$(path_data)\"/>\n")
        write(f, "</svg>\n")
    end
    println("SVG file successfully generated!")
end

# --- Run the main function ---
generate_lorenz_svg()

