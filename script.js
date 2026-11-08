import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==================================================
// 1. CONFIGURAZIONE GENERALE
// ==================================================

const container = document.getElementById('scene-container');

if (!container) {
    throw new Error('Elemento scene-container non trovato.');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color('#e9e4ef');

const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(5.5, 4.1, 7.5);

// ==================================================
// 2. RENDERER
// ==================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

container.appendChild(renderer.domElement);

// ==================================================
// 3. CONTROLLI 3D
// ==================================================

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.target.set(0, 1.25, -0.15);

controls.minDistance = 3.5;
controls.maxDistance = 12;

controls.maxPolarAngle = Math.PI / 2.05;

// ==================================================
// 4. ILLUMINAZIONE
// ==================================================

const ambientLight = new THREE.AmbientLight(
    '#ffffff',
    1.5
);

scene.add(ambientLight);

// Luce principale
const mainLight = new THREE.DirectionalLight(
    '#ffffff',
    3.2
);

mainLight.position.set(4, 8, 5);

mainLight.castShadow = true;

mainLight.shadow.mapSize.set(2048, 2048);

mainLight.shadow.camera.left = -6;
mainLight.shadow.camera.right = 6;
mainLight.shadow.camera.top = 6;
mainLight.shadow.camera.bottom = -6;

scene.add(mainLight);

// Luce laterale viola
const violetLight = new THREE.PointLight(
    '#c5a4ff',
    30,
    12
);

violetLight.position.set(-3, 3, 2);

scene.add(violetLight);

// Luce frontale
const frontLight = new THREE.PointLight(
    '#ffffff',
    20,
    10
);

frontLight.position.set(3, 3, 4);

scene.add(frontLight);

// ==================================================
// 5. MATERIALI
// ==================================================

const materials = {

    violet: new THREE.MeshStandardMaterial({
        color: '#65418b',
        roughness: 0.55
    }),

    darkViolet: new THREE.MeshStandardMaterial({
        color: '#39204f',
        roughness: 0.4
    }),

    lightViolet: new THREE.MeshStandardMaterial({
        color: '#e9def2',
        roughness: 0.35
    }),

    white: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.35
    }),

    silver: new THREE.MeshStandardMaterial({
        color: '#c3c6ce',
        metalness: 0.85,
        roughness: 0.22
    }),

    gold: new THREE.MeshStandardMaterial({
        color: '#c5a34a',
        metalness: 0.8,
        roughness: 0.2
    }),

    green: new THREE.MeshStandardMaterial({
        color: '#527d61',
        roughness: 0.7
    })

};

// Materiali personalizzabili
const wallMaterial = materials.violet.clone();
const deskMaterial = materials.lightViolet.clone();

// ==================================================
// 6. PAVIMENTO
// ==================================================

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        color: '#e8e5eb',
        roughness: 0.85
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.025;
floor.receiveShadow = true;

scene.add(floor);

// Ombra di appoggio
const stand = new THREE.Group();

scene.add(stand);

// ==================================================
// 7. PEDANA
// ==================================================

const platform = new THREE.Mesh(
    new THREE.BoxGeometry(3.35, 0.12, 2.7),
    new THREE.MeshStandardMaterial({
        color: '#f8f6fa',
        roughness: 0.3,
        metalness: 0.12
    })
);

platform.position.set(0, 0.06, -0.5);

platform.castShadow = true;
platform.receiveShadow = true;

scene.add(platform);

// Profili metallici della pedana

function createBox(width, height, depth, material, x, y, z) {

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    stand.add(mesh);

    return mesh;
}

// Bordo anteriore
createBox(
    3.35, 0.035, 0.035,
    materials.silver,
    0, 0.075, 0.85
);

// Bordo sinistro
createBox(
    0.035, 0.035, 2.7,
    materials.silver,
    -1.675, 0.075, -0.5
);

// Bordo destro
createBox(
    0.035, 0.035, 2.7,
    materials.silver,
    1.675, 0.075, -0.5
);

// ==================================================
// 8. PARETE POSTERIORE
// ==================================================

const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2.5, 0.12),
    wallMaterial
);

backWall.position.set(0, 1.37, -1);

backWall.castShadow = true;

stand.add(backWall);

// Profili argentati

createBox(
    3.08, 0.045, 0.15,
    materials.silver,
    0, 2.63, -1
);

createBox(
    3.08, 0.045, 0.15,
    materials.silver,
    0, 0.12, -1
);

// ==================================================
// 9. PANNELLI LATERALI
// ==================================================

const leftPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 2.5, 1),
    wallMaterial
);

leftPanel.position.set(-1.44, 1.37, -0.5);

leftPanel.castShadow = true;

stand.add(leftPanel);

const rightPanel = leftPanel.clone();

rightPanel.position.x = 1.44;

stand.add(rightPanel);

// Profili decorativi laterali

createBox(
    0.025, 2.35, 0.025,
    materials.silver,
    -1.37, 1.37, -0.5
);

createBox(
    0.025, 2.35, 0.025,
    materials.silver,
    1.37, 1.37, -0.5
);

// ==================================================
// 10. FUNZIONE PER GRAFICHE E LOGHI
// ==================================================

function createGraphicCanvas(width, height, drawFunction) {

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    drawFunction(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    return texture;
}

// Crea una superficie grafica mantenendo le proporzioni
function createGraphicPlane(
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
            side: THREE.DoubleSide
        })
    );

    mesh.position.set(x, y, z);

    parent.add(mesh);

    return mesh;
}

// ==================================================
// 11. GRAFICA PRINCIPALE DEL FONDALE
// ==================================================

const wallTexture = createGraphicCanvas(
    1200,
    900,
    (ctx, w, h) => {

        // Sfondo
        const gradient = ctx.createLinearGradient(0, 0, w, h);

        gradient.addColorStop(0, '#fbf9fd');
        gradient.addColorStop(1, '#e9def2');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Forma decorativa
        ctx.beginPath();
        ctx.arc(1100, 80, 320, 0, Math.PI * 2);

        ctx.fillStyle = 'rgba(138,98,173,0.12)';
        ctx.fill();

        // Forma inferiore
        ctx.beginPath();
        ctx.ellipse(100, 850, 300, 150, 0, 0, Math.PI * 2);

        ctx.fillStyle = 'rgba(101,65,139,0.07)';
        ctx.fill();

        // Logo
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#513267';

        ctx.font = 'bold 145px Arial';

        ctx.fillText('LAIKA', 600, 330);

        // Pharma
        ctx.fillStyle = '#8a62ad';

        ctx.font = 'bold 58px Arial';

        ctx.fillText('PHARMA', 600, 440);

        // Linea
        ctx.fillStyle = '#b99aca';

        ctx.fillRect(390, 500, 420, 5);

        // Messaggio
        ctx.fillStyle = '#493b52';

        ctx.font = 'bold 37px Arial';

        ctx.fillText(
            'SCIENCE  •  CARE  •  INNOVATION',
            600,
            600
        );

        // Testo secondario
        ctx.fillStyle = '#75677e';

        ctx.font = '30px Arial';

        ctx.fillText(
            'Innovazione al servizio del benessere',
            600,
            670
        );

    }
);

// Il rapporto è 1200:900 = 4:3.
// Anche la superficie 2.4:1.8 = 4:3.
// Questo evita di deformare il logo.
createGraphicPlane(
    wallTexture,
    2.4,
    1.8,
    -0.35,
    1.45,
    -0.925
);

// ==================================================
// 12. INSEGNA SUPERIORE
// ==================================================

const sign = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.28, 0.22),
    new THREE.MeshStandardMaterial({
        color: '#432857',
        metalness: 0.25,
        roughness: 0.35,
        emissive: '#65418b',
        emissiveIntensity: 0.25
    })
);

sign.position.set(0, 2.78, -1);

stand.add(sign);

// Grafica insegna
const signTexture = createGraphicCanvas(
    1400,
    140,
    (ctx, w, h) => {

        ctx.fillStyle = '#432857';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 85px Arial';

        ctx.fillText('LAIKA  PHARMA', w / 2, h / 2);

    }
);

// Rapporto 10:1
createGraphicPlane(
    signTexture,
    2.8,
    0.28,
    0,
    2.78,
    -0.875
);

// ==================================================
// 13. BANCO RECEPTION
// ==================================================

const desk = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1, 0.55),
    deskMaterial
);

desk.position.set(0, 0.62, 0.45);

desk.castShadow = true;
desk.receiveShadow = true;

stand.add(desk);

// Piano superiore
createBox(
    1.4, 0.08, 0.65,
    materials.white,
    0, 1.16, 0.45
);

// Base argentata
createBox(
    1.32, 0.06, 0.57,
    materials.silver,
    0, 0.18, 0.45
);

// Grafica reception
const deskTexture = createGraphicCanvas(
    1000,
    250,
    (ctx, w, h) => {

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#65418b';

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = 'bold 150px Arial';

        ctx.fillText('LAIKA', w / 2, h / 2);

    }
);

// Rapporto 4:1, identico al canvas.
createGraphicPlane(
    deskTexture,
    1,
    0.25,
    0,
    0.62,
    0.733
);

// ==================================================
// 14. MONITOR PUBBLICITARIO
// ==================================================

// Cornice argentata
createBox(
    0.72, 0.62, 0.07,
    materials.silver,
    1.05, 1.48, -0.91
);

// Schermo
const monitorTexture = createGraphicCanvas(
    1024,
    640,
    (ctx, w, h) => {

        const gradient = ctx.createLinearGradient(0, 0, w, h);

        gradient.addColorStop(0, '#39204f');
        gradient.addColorStop(1, '#8a62ad');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Decorazione
        ctx.beginPath();
        ctx.arc(850, 120, 180, 0, Math.PI * 2);

        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fill();

        ctx.textAlign = 'center';

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 115px Arial';

        ctx.fillText('LAIKA', 512, 250);

        ctx.font = 'bold 55px Arial';

        ctx.fillText('PHARMA', 512, 330);

        ctx.fillStyle = '#e8dcf5';
        ctx.font = '32px Arial';

        ctx.fillText(
            'INNOVATION & WELLNESS',
            512,
            430
        );

        ctx.fillStyle = '#ffffff';

        ctx.fillRect(350, 480, 324, 5);

    }
);

// Rapporto 1024:640 = 1.6.
// Schermo 0.64:0.40 = 1.6.
createGraphicPlane(
    monitorTexture,
    0.64,
    0.40,
    1.05,
    1.48,
    -0.868
);

// LED monitor
const monitorLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 16, 16),
    new THREE.MeshBasicMaterial({
        color: '#66ff99'
    })
);

monitorLed.position.set(1.32, 1.18, -0.86);

stand.add(monitorLed);

// ==================================================
// 15. VETRINA ESPOSITIVA
// ==================================================

// Piedistallo
createBox(
    0.75, 0.12, 0.65,
    materials.white,
    1.05, 0.18, 0.25
);

// Vetro
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.18,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.65,
    thickness: 0.1
});

const glassBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.65, 0.62),
    glassMaterial
);

glassBox.position.set(1.05, 0.565, 0.25);

stand.add(glassBox);

// Cornice superiore
createBox(
    0.76, 0.035, 0.66,
    materials.silver,
    1.05, 0.91, 0.25
);

// Cornice inferiore
createBox(
    0.76, 0.035, 0.66,
    materials.silver,
    1.05, 0.23, 0.25
);

// Gadget
const gadgetMaterial = new THREE.MeshStandardMaterial({
    color: '#65418b',
    metalness: 0.25,
    roughness: 0.3
});

const gadgetPositions = [
    [0.85, 0.42, 0.15],
    [1.05, 0.42, 0.15],
    [1.25, 0.42, 0.15]
];

gadgetPositions.forEach(position => {

    const gadget = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.13, 0.08),
        gadgetMaterial
    );

    gadget.position.set(
        position[0],
        position[1],
        position[2]
    );

    gadget.castShadow = true;

    stand.add(gadget);

});

// Portachiavi
function createKeychain(x, z) {

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.045, 0.009, 12, 32),
        materials.gold
    );

    ring.position.set(x, 0.59, z);

    stand.add(ring);

}

createKeychain(0.95, 0.25);
createKeychain(1.15, 0.25);

// ==================================================
// 16. SGABELLO
// ==================================================

// Base
const stoolBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.23, 0.06, 32),
    materials.silver
);

stoolBase.position.set(-1.05, 0.17, 0.45);

stand.add(stoolBase);

// Colonna
const stoolColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.42, 24),
    materials.silver
);

stoolColumn.position.set(-1.05, 0.41, 0.45);

stand.add(stoolColumn);

// Poggiapiedi
const footrest = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.012, 12, 32),
    materials.silver
);

footrest.position.set(-1.05, 0.32, 0.45);

footrest.rotation.x = Math.PI / 2;

stand.add(footrest);

// Seduta
const stoolSeat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.19, 0.11, 32),
    new THREE.MeshStandardMaterial({
        color: '#65418b',
        roughness: 0.35
    })
);

stoolSeat.position.set(-1.05, 0.68, 0.45);

stoolSeat.castShadow = true;

stand.add(stoolSeat);

// ==================================================
// 17. PIANTA DECORATIVA
// ==================================================

const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.10, 0.28, 32),
    materials.lightViolet
);

pot.position.set(-1.15, 0.32, -0.65);

stand.add(pot);

// Foglie
const leafPositions = [
    [-1.15, 0.65, -0.65],
    [-1.28, 0.58, -0.65],
    [-1.02, 0.58, -0.65],
    [-1.15, 0.58, -0.52],
    [-1.15, 0.58, -0.78]
];

leafPositions.forEach(position => {

    const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 20, 20),
        materials.green
    );

    leaf.position.set(
        position[0],
        position[1],
        position[2]
    );

    leaf.scale.set(0.75, 1.5, 0.75);

    stand.add(leaf);

});

// ==================================================
// 18. DETTAGLI DECORATIVI
// ==================================================

// Linee luminose laterali
const accentMaterial = new THREE.MeshBasicMaterial({
    color: '#d8c1ed'
});

// Linea decorativa parete
createBox(
    0.025, 1.7, 0.018,
    accentMaterial,
    -1.25, 1.45, -0.925
);

createBox(
    0.025, 1.7, 0.018,
    accentMaterial,
    1.25, 1.45, -0.925
);

// Faretti superiori
for (let i = 0; i < 3; i++) {

    const spotlight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.07, 0.10, 24),
        materials.silver
    );

    spotlight.position.set(
        -0.9 + i * 0.9,
        2.48,
        -0.82
    );

    stand.add(spotlight);

}

// ==================================================
// 19. PERSONALIZZAZIONE COLORI
// ==================================================

const wallColorInput = document.getElementById('wallColor');

const deskColorInput = document.getElementById('deskColor');

const resetButton = document.getElementById('resetButton');

if (wallColorInput) {

    wallColorInput.addEventListener('input', event => {

        wallMaterial.color.set(event.target.value);

    });

}

if (deskColorInput) {

    deskColorInput.addEventListener('input', event => {

        deskMaterial.color.set(event.target.value);

    });

}

if (resetButton) {

    resetButton.addEventListener('click', () => {

        wallMaterial.color.set('#65418b');

        deskMaterial.color.set('#e9def2');

        if (wallColorInput) {
            wallColorInput.value = '#65418b';
        }

        if (deskColorInput) {
            deskColorInput.value = '#e9def2';
        }

    });

}

// ==================================================
// 20. ADATTAMENTO FINESTRA
// ==================================================

window.addEventListener('resize', () => {

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

});

// ==================================================
// 21. ANIMAZIONE
// ==================================================

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();