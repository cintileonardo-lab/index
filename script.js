import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ============================================================
// LAYCA PHARMA — PREMIUM EXHIBITION DESIGN
// Unità di misura: metri
// ============================================================

// 1. CONFIGURAZIONE

const container = document.getElementById('scene-container');

if (!container) {
    throw new Error('Elemento scene-container non trovato.');
}

const COLORS = {
    navy: '#0B2942',
    blue: '#123B5D',
    cyan: '#1686A5',
    turquoise: '#35B8B0',
    green: '#35A86B',
    ice: '#E6F1F3',
    white: '#FFFFFF',
    floor: '#EDF2F4',
    silver: '#BCC9D0'
};

const DIMENSIONS = {
    platformWidth: 3,
    platformDepth: 1.91,
    platformHeight: 0.12,

    wallWidth: 3,
    wallHeight: 2.5,
    wallDepth: 0.12,

    standHeight: 2.92
};

const scene = new THREE.Scene();

scene.background = new THREE.Color('#F3F7F8');

scene.fog = new THREE.Fog(
    '#F3F7F8',
    12,
    25
);

// ============================================================
// 2. CAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(5.1, 3.6, 7.1);

// ============================================================
// 3. RENDERER
// ============================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

renderer.useLegacyLights = false;

renderer.domElement.style.display = 'block';

container.appendChild(renderer.domElement);

// ============================================================
// 4. CONTROLLI
// ============================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.055;

controls.target.set(0, 1.30, -0.10);

controls.minDistance = 3.5;
controls.maxDistance = 10;

controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI / 2.05;

controls.enablePan = true;
controls.panSpeed = 0.6;

controls.update();

// ============================================================
// 5. ILLUMINAZIONE
// ============================================================

// Illuminazione ambientale

const ambient = new THREE.HemisphereLight(
    '#FFFFFF',
    '#C5D5DC',
    2.0
);

scene.add(ambient);

// Luce principale

const mainLight = new THREE.DirectionalLight(
    '#FFFFFF',
    3.0
);

mainLight.position.set(4, 8, 5);

mainLight.castShadow = true;

mainLight.shadow.mapSize.set(2048, 2048);

mainLight.shadow.camera.left = -5;
mainLight.shadow.camera.right = 5;
mainLight.shadow.camera.top = 5;
mainLight.shadow.camera.bottom = -5;

mainLight.shadow.bias = -0.0002;
mainLight.shadow.normalBias = 0.025;

scene.add(mainLight);

// Luce frontale morbida

const frontLight = new THREE.DirectionalLight(
    '#FFFFFF',
    1.4
);

frontLight.position.set(-4, 4, 6);

scene.add(frontLight);

// Luce turchese

const turquoiseLight = new THREE.PointLight(
    COLORS.turquoise,
    22,
    9
);

turquoiseLight.position.set(-2, 2.5, 1);

scene.add(turquoiseLight);

// Luce di riempimento

const fillLight = new THREE.PointLight(
    '#D8F1F5',
    15,
    10
);

fillLight.position.set(3, 3, -2);

scene.add(fillLight);

// ============================================================
// 6. MATERIALI
// ============================================================

const materials = {

    navy: new THREE.MeshStandardMaterial({
        color: COLORS.navy,
        roughness: 0.48,
        metalness: 0.12
    }),

    blue: new THREE.MeshStandardMaterial({
        color: COLORS.blue,
        roughness: 0.48
    }),

    ice: new THREE.MeshStandardMaterial({
        color: COLORS.ice,
        roughness: 0.42
    }),

    white: new THREE.MeshStandardMaterial({
        color: COLORS.white,
        roughness: 0.32
    }),

    silver: new THREE.MeshStandardMaterial({
        color: COLORS.silver,
        metalness: 0.82,
        roughness: 0.25
    }),

    green: new THREE.MeshStandardMaterial({
        color: COLORS.green,
        roughness: 0.55
    }),

    turquoise: new THREE.MeshBasicMaterial({
        color: COLORS.turquoise
    })

};

const wallMaterial = materials.blue.clone();
const deskMaterial = materials.ice.clone();

// ============================================================
// 7. GRUPPO PRINCIPALE
// ============================================================

const stand = new THREE.Group();

scene.add(stand);

// ============================================================
// 8. FUNZIONI GEOMETRICHE
// ============================================================

function addBox(
    width,
    height,
    depth,
    material,
    x,
    y,
    z,
    parent = stand,
    radius = 0
) {

    const geometry = radius > 0
        ? new RoundedBoxGeometry(
            width,
            height,
            depth,
            4,
            radius
        )
        : new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
}

function addCylinder(
    radiusTop,
    radiusBottom,
    height,
    material,
    x,
    y,
    z,
    parent = stand
) {

    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            32
        ),
        material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
}

// ============================================================
// 9. PAVIMENTO
// ============================================================

const floorMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.floor,
    roughness: 0.85,
    metalness: 0
});

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.015;

floor.receiveShadow = true;

scene.add(floor);

// ============================================================
// 10. PEDANA
// ============================================================

// Corpo principale

const platform = addBox(
    3.00,
    0.12,
    1.91,
    new THREE.MeshStandardMaterial({
        color: '#F8FAFB',
        roughness: 0.3,
        metalness: 0.08
    }),
    0,
    0.06,
    -0.105,
    stand,
    0.035
);

// Profili metallici perimetrali

const trimMaterial = materials.silver;

addBox(
    2.94,
    0.025,
    0.025,
    trimMaterial,
    0,
    0.08,
    0.84
);

addBox(
    2.94,
    0.025,
    0.025,
    trimMaterial,
    0,
    0.08,
    -1.05
);

addBox(
    0.025,
    0.025,
    1.86,
    trimMaterial,
    -1.48,
    0.08,
    -0.105
);

addBox(
    0.025,
    0.025,
    1.86,
    trimMaterial,
    1.48,
    0.08,
    -0.105
);

// ============================================================
// 11. PARETI ARCHITETTONICHE
// ============================================================

// Parete posteriore

addBox(
    3.00,
    2.50,
    0.12,
    wallMaterial,
    0,
    1.37,
    -0.945,
    stand
);

// Parete laterale sinistra

addBox(
    0.12,
    2.50,
    1.10,
    wallMaterial,
    -1.44,
    1.37,
    -0.395,
    stand
);

// Parete laterale destra

addBox(
    0.12,
    2.50,
    1.10,
    wallMaterial,
    1.44,
    1.37,
    -0.395,
    stand
);

// Profili superiori

addBox(
    3.05,
    0.045,
    0.15,
    materials.silver,
    0,
    2.645,
    -0.945
);

// Profili laterali verticali

addBox(
    0.025,
    2.30,
    0.025,
    materials.silver,
    -1.365,
    1.37,
    -0.40
);

addBox(
    0.025,
    2.30,
    0.025,
    materials.silver,
    1.365,
    1.37,
    -0.40
);

// ============================================================
// 12. TEXTURE GRAFICHE
// ============================================================

function createCanvasTexture(
    width,
    height,
    draw
) {

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    draw(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    texture.anisotropy =
        renderer.capabilities.getMaxAnisotropy();

    return texture;
}

function addGraphic(
    texture,
    width,
    height,
    x,
    y,
    z,
    parent = stand
) {

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            toneMapped: false
        })
    );

    mesh.position.set(x, y, z);

    parent.add(mesh);

    return mesh;
}

// ============================================================
// 13. GRAFICA PARETE POSTERIORE
// ============================================================

const wallTexture = createCanvasTexture(
    1400,
    1000,
    (ctx, w, h) => {

        const gradient = ctx.createLinearGradient(
            0,
            0,
            w,
            h
        );

        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#E6F1F3');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Elementi grafici decorativi

        ctx.fillStyle = 'rgba(22,134,165,0.10)';

        ctx.beginPath();
        ctx.arc(1300, 50, 320, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(53,184,176,0.10)';

        ctx.beginPath();
        ctx.ellipse(
            100,
            950,
            300,
            160,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Logo

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = COLORS.blue;

        ctx.font = 'bold 155px Arial';

        ctx.fillText(
            'LAYCA',
            w / 2,
            365
        );

        ctx.fillStyle = COLORS.cyan;

        ctx.font = 'bold 65px Arial';

        ctx.fillText(
            'PHARMA',
            w / 2,
            475
        );

        // Linea decorativa

        ctx.fillStyle = COLORS.green;

        ctx.fillRect(
            430,
            550,
            540,
            7
        );

        // Claim

        ctx.fillStyle = COLORS.blue;

        ctx.font = 'bold 38px Arial';

        ctx.fillText(
            'SCIENCE  •  CARE  •  INNOVATION',
            w / 2,
            665
        );

        ctx.fillStyle = '#607C89';

        ctx.font = '30px Arial';

        ctx.fillText(
            'Innovazione al servizio del benessere',
            w / 2,
            740
        );

    }
);

addGraphic(
    wallTexture,
    2.45,
    1.75,
    -0.20,
    1.48,
    -0.879
);

// ============================================================
// 14. INSEGNA SUPERIORE
// ============================================================

const signMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.navy,
    roughness: 0.3,
    metalness: 0.25,
    emissive: COLORS.navy,
    emissiveIntensity: 0.18
});

addBox(
    3.05,
    0.27,
    0.19,
    signMaterial,
    0,
    2.79,
    -0.90,
    stand,
    0.035
);

const signTexture = createCanvasTexture(
    1400,
    160,
    (ctx, w, h) => {

        ctx.fillStyle = COLORS.navy;

        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#FFFFFF';

        ctx.font = 'bold 95px Arial';

        ctx.fillText(
            'LAYCA PHARMA',
            w / 2,
            h / 2
        );

    }
);

addGraphic(
    signTexture,
    2.82,
    0.27,
    0,
    2.79,
    -0.799
);

// ============================================================
// 15. ILLUMINAZIONE LED
// ============================================================

// Linee LED verticali

function addLED(x, y, z, height) {

    const led = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.018,
            height,
            0.012
        ),
        materials.turquoise
    );

    led.position.set(x, y, z);

    stand.add(led);

    return led;
}

addLED(-1.24, 1.48, -0.878, 1.65);
addLED(1.24, 1.48, -0.878, 1.65);

// ============================================================
// 16. RECEPTION
// ============================================================

// Corpo reception

const desk = addBox(
    1.32,
    0.98,
    0.57,
    deskMaterial,
    0,
    0.63,
    0.43,
    stand,
    0.045
);

// Piano superiore

addBox(
    1.42,
    0.075,
    0.66,
    materials.white,
    0,
    1.155,
    0.43,
    stand,
    0.025
);

// Base metallica

addBox(
    1.25,
    0.055,
    0.54,
    materials.silver,
    0,
    0.17,
    0.43,
    stand,
    0.015
);

// Fascia decorativa frontale

addBox(
    1.15,
    0.025,
    0.012,
    materials.turquoise,
    0,
    0.34,
    0.721
);

// Logo reception

const deskTexture = createCanvasTexture(
    1000,
    250,
    (ctx, w, h) => {

        ctx.clearRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = COLORS.blue;

        ctx.font = 'bold 155px Arial';

        ctx.fillText(
            'LAYCA',
            w / 2,
            h / 2
        );

    }
);

addGraphic(
    deskTexture,
    0.95,
    0.24,
    0,
    0.67,
    0.723
);

// ============================================================
// 17. MONITOR PUBBLICITARIO
// ============================================================

// Cornice

addBox(
    0.76,
    0.64,
    0.075,
    materials.silver,
    1.04,
    1.55,
    -0.825,
    stand,
    0.025
);

// Schermo

const monitorTexture = createCanvasTexture(
    1024,
    700,
    (ctx, w, h) => {

        const gradient = ctx.createLinearGradient(
            0,
            0,
            w,
            h
        );

        gradient.addColorStop(0, COLORS.navy);
        gradient.addColorStop(1, COLORS.cyan);

        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(53,184,176,0.18)';

        ctx.beginPath();

        ctx.arc(
            900,
            100,
            180,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.textAlign = 'center';

        ctx.fillStyle = '#FFFFFF';

        ctx.font = 'bold 120px Arial';

        ctx.fillText(
            'LAYCA',
            w / 2,
            270
        );

        ctx.font = 'bold 58px Arial';

        ctx.fillText(
            'PHARMA',
            w / 2,
            355
        );

        ctx.fillStyle = '#E2F4F5';

        ctx.font = '34px Arial';

        ctx.fillText(
            'INNOVATION & WELLNESS',
            w / 2,
            465
        );

        ctx.fillStyle = '#FFFFFF';

        ctx.fillRect(
            350,
            520,
            324,
            5
        );

    }
);

addGraphic(
    monitorTexture,
    0.69,
    0.49,
    1.04,
    1.55,
    -0.784
);

// LED indicatore

const monitorLed = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.012,
        16,
        16
    ),
    new THREE.MeshBasicMaterial({
        color: '#65FF9B'
    })
);

monitorLed.position.set(
    1.34,
    1.20,
    -0.78
);

stand.add(monitorLed);

// ============================================================
// 18. VETRINA ESPOSITIVA
// ============================================================

// Base

addBox(
    0.78,
    0.13,
    0.67,
    materials.white,
    1.04,
    0.19,
    0.20,
    stand,
    0.025
);

// Materiale vetro

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    transparent: true,
    opacity: 0.22,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.35,
    thickness: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false
});

// Vetro frontale

addBox(
    0.73,
    0.62,
    0.018,
    glassMaterial,
    1.04,
    0.565,
    0.525
);

// Vetro posteriore

addBox(
    0.73,
    0.62,
    0.018,
    glassMaterial,
    1.04,
    0.565,
    -0.125
);

// Vetri laterali

addBox(
    0.018,
    0.62,
    0.65,
    glassMaterial,
    0.675,
    0.565,
    0.20
);

addBox(
    0.018,
    0.62,
    0.65,
    glassMaterial,
    1.405,
    0.565,
    0.20
);

// Cornice superiore

addBox(
    0.78,
    0.035,
    0.70,
    materials.silver,
    1.04,
    0.895,
    0.20,
    stand,
    0.012
);

// Cornice inferiore

addBox(
    0.78,
    0.035,
    0.70,
    materials.silver,
    1.04,
    0.255,
    0.20,
    stand,
    0.012
);

// ============================================================
// 19. PRODOTTI ESPOSITIVI
// ============================================================

const productMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.blue,
    roughness: 0.28,
    metalness: 0.12
});

const productWhite = new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.35
});

const productPositions = [
    [0.82, 0.43, 0.12],
    [1.04, 0.43, 0.12],
    [1.26, 0.43, 0.12]
];

productPositions.forEach((position, index) => {

    const product = addBox(
        0.13,
        0.20,
        0.11,
        index === 1 ? productWhite : productMaterial,
        position[0],
        position[1],
        position[2]
    );

    addBox(
        0.105,
        0.012,
        0.012,
        materials.turquoise,
        position[0],
        position[1],
        position[2] + 0.061
    );

});

// ============================================================
// 20. PORTACHIAVI DECORATIVI
// ============================================================

function createKeychain(x, z) {

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
            0.045,
            0.009,
            12,
            32
        ),
        materials.silver
    );

    ring.position.set(
        x,
        0.58,
        z
    );

    stand.add(ring);

}

createKeychain(0.94, 0.27);
createKeychain(1.14, 0.27);

// ============================================================
// 21. SGABELLO
// ============================================================

// Base

addCylinder(
    0.23,
    0.23,
    0.055,
    materials.silver,
    -1.02,
    0.16,
    0.43
);

// Colonna

addCylinder(
    0.035,
    0.045,
    0.43,
    materials.silver,
    -1.02,
    0.405,
    0.43
);

// Poggiapiedi

const footrest = new THREE.Mesh(
    new THREE.TorusGeometry(
        0.14,
        0.012,
        12,
        32
    ),
    materials.silver
);

footrest.position.set(
    -1.02,
    0.32,
    0.43
);

footrest.rotation.x = Math.PI / 2;

stand.add(footrest);

// Seduta

addCylinder(
    0.19,
    0.19,
    0.11,
    materials.navy,
    -1.02,
    0.68,
    0.43
);

// ============================================================
// 22. PIANTA DECORATIVA
// ============================================================

// Vaso

const potMaterial = new THREE.MeshStandardMaterial({
    color: '#E6F1F3',
    roughness: 0.3
});

addCylinder(
    0.13,
    0.10,
    0.28,
    potMaterial,
    -1.16,
    0.32,
    -0.64
);

// Terriccio

addCylinder(
    0.105,
    0.105,
    0.012,
    new THREE.MeshStandardMaterial({
        color: '#55483D'
    }),
    -1.16,
    0.465,
    -0.64
);

// Foglie

const leafMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.green,
    roughness: 0.58
});

const leafPositions = [
    [-1.16, 0.65, -0.64],
    [-1.29, 0.59, -0.64],
    [-1.03, 0.59, -0.64],
    [-1.16, 0.59, -0.51],
    [-1.16, 0.59, -0.77],
    [-1.25, 0.72, -0.57],
    [-1.07, 0.72, -0.70]
];

leafPositions.forEach((position, index) => {

    const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.10,
            20,
            20
        ),
        leafMaterial
    );

    leaf.position.set(
        position[0],
        position[1],
        position[2]
    );

    leaf.scale.set(
        0.75,
        1.5,
        0.65
    );

    leaf.rotation.z =
        (index % 2 === 0 ? 1 : -1) * 0.25;

    stand.add(leaf);

});

// ============================================================
// 23. FARETTI SUPERIORI
// ============================================================

for (let i = 0; i < 3; i++) {

    const x = -0.9 + i * 0.9;

    // Corpo faretto

    addCylinder(
        0.055,
        0.065,
        0.09,
        materials.silver,
        x,
        2.48,
        -0.81
    );

    // Diffusore luminoso

    const diffuser = new THREE.Mesh(
        new THREE.CircleGeometry(
            0.045,
            24
        ),
        new THREE.MeshBasicMaterial({
            color: '#FFFFFF'
        })
    );

    diffuser.rotation.x = -Math.PI / 2;

    diffuser.position.set(
        x,
        2.43,
        -0.81
    );

    stand.add(diffuser);

}

// ============================================================
// 24. PERSONALIZZAZIONE COLORI
// ============================================================

const wallColorInput =
    document.getElementById('wallColor');

const deskColorInput =
    document.getElementById('deskColor');

const resetButton =
    document.getElementById('resetButton');

if (wallColorInput) {

    wallColorInput.value = COLORS.blue;

    wallColorInput.addEventListener('input', event => {

        wallMaterial.color.set(event.target.value);

    });

}

if (deskColorInput) {

    deskColorInput.value = COLORS.ice;

    deskColorInput.addEventListener('input', event => {

        deskMaterial.color.set(event.target.value);

    });

}

if (resetButton) {

    resetButton.addEventListener('click', () => {

        wallMaterial.color.set(COLORS.blue);
        deskMaterial.color.set(COLORS.ice);

        if (wallColorInput) {
            wallColorInput.value = COLORS.blue;
        }

        if (deskColorInput) {
            deskColorInput.value = COLORS.ice;
        }

    });

}

// ============================================================
// 25. POSIZIONE INIZIALE
// ============================================================

function resetCamera() {

    camera.position.set(
        5.1,
        3.6,
        7.1
    );

    controls.target.set(
        0,
        1.30,
        -0.10
    );

    controls.update();

}

// ============================================================
// 26. RESIZE RESPONSIVE
// ============================================================

function resizeRenderer() {

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

}

window.addEventListener(
    'resize',
    resizeRenderer
);

const resizeObserver = new ResizeObserver(() => {
    resizeRenderer();
});

resizeObserver.observe(container);

// ============================================================
// 27. ANIMAZIONE
// ============================================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    controls.update();

    renderer.render(
        scene,
        camera
    );

}

animate();

// ============================================================
// 28. PULIZIA
// ============================================================

window.addEventListener('beforeunload', () => {

    resizeObserver.disconnect();

    controls.dispose();

    renderer.dispose();

});