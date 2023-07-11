import { Canvas } from "@react-three/fiber";
import styles from "../styles/Three.module.css"
import { OrthographicCamera } from "@react-three/drei";



function Box(props) {
    return (
        <mesh {...props}>
            <boxGeometry args={[1, 1, 1]} />
            <meshLambertMaterial attach="material" color="hotpink" />
        </mesh>
    )
}


export default function ThreeScene() {

    const config = {
        position: [0, 0, 1],
    }



    return <div className={styles.sceneContainer}>
        <Canvas camera={...config}>
            <Box position={[0, 0, 0]} ></Box>
            <directionalLight
                intensity={1}
                castShadow
                shadow-bias={-0.0002}
                shadow-mapSize={[2048, 2048]}
                position={[85.0, 80.0, 70.0]}
                shadow-camera-left={-30}
                shadow-camera-right={30}
                shadow-camera-top={30}
                shadow-camera-bottom={-30}
            />


        </Canvas>
    </div>

}