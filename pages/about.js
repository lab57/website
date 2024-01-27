import Layout from "../components/layout"
import dynamic from "next/dynamic";



let content = `\\begin{aligned}
\\dot{x} &= \\sigma(y - x) \\\\
\\dot{y} &= x(\\rho - z) - y \\\\
\\dot{z} &= x y - \\beta z
\\end{aligned}


`
export default function about() {
    return <Layout>



        <h1>About Luc</h1>
        Hi! I'm currently an undergraduate student at the University of Massachusetts Amherst. I have a broad range of interests
        across physics, computer science, and math, but primarily have been exploring research topics in nuclear physics, neutrino physics,
        and quantum information science. I'm currently seeking graduate positions in these or related areas, as well as internship opportunities.
        <br />
        <br />
        {/* Aside from the nerdy things, I play guitar, rock climb, play video games, and I've been learning silversmithing! */}

        <h1>About This Website</h1>
        <p>
            This website is written using Next.JS, and hosted via Vercel. The background is a numerical
            simulation of the Lorenz system:

            $$ {content} $$

            with the typical values of the parameters, $\rho = 28, \sigma=10,$ and $\beta= \frac{8}{3}$.
            For these values, the Lorenz system has chaotic solutions, with chaotic orbits around two strange attractors.
            The numerical calculations are done using the fourth order Runge-Kutta method, and written in Javascript.
            The graphics are rendered using P5.js.
            You can click to add an additional particle, and press 'X' to delete one.




        </p>

        <p>


        </p>

    </Layout>
}