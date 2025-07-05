const planetInfo = [
    { name: 'Mercury', color: 0xaaaaaa, size: 0.3, distance: 4 },
    { name: 'Venus', color: 0xffcc99, size: 0.6, distance: 6 },
    { name: 'Earth', color: 0x3399ff, size: 0.6, distance: 8 },
    { name: 'Mars', color: 0xff3300, size: 0.4, distance: 10 },
    { name: 'Jupiter', color: 0xff9966, size: 1.2, distance: 14 },
    { name: 'Saturn', color: 0xffcc66, size: 1.1, distance: 18 },
    { name: 'Uranus', color: 0x66ffff, size: 0.9, distance: 22 },
    { name: 'Neptune', color: 0x3366cc, size: 0.9, distance: 26 }
  ];
  
  // Initialize
  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
  
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("solarSystemCanvas"), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // Lighting
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(0, 0, 0);
    scene.add(light);
  
    // Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
  
    // Create Planets
    planetInfo.forEach(({ name, color, size, distance }, index) => {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color });
      const planet = new THREE.Mesh(geometry, material);
      scene.add(planet);
      planets.push(planet);
  
      // Orbit data
      orbitData[name] = {
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 * (1 / (index + 1)), // default speed
        distance
      };
  
      // Create control slider
      const control = document.createElement("label");
      control.innerHTML = `
        ${name}: <input type="range" min="0" max="0.05" step="0.001" value="${orbitData[name].speed}" data-name="${name}"/>
      `;
      document.getElementById("controls").appendChild(control);
    });
  
    document.getElementById("controls").addEventListener("input", (e) => {
      const input = e.target;
      if (input.tagName === "INPUT" && input.type === "range") {
        const name = input.dataset.name;
        orbitData[name].speed = parseFloat(input.value);
      }
    });
  
    document.getElementById("pauseResumeBtn").addEventListener("click", () => {
      isPaused = !isPaused;
      document.getElementById("pauseResumeBtn").innerText = isPaused ? "Resume" : "Pause";
    });
  
    clock = new THREE.Clock();
    animate();
  }
  
  function animate() {
    requestAnimationFrame(animate);
    if (!isPaused) {
      planets.forEach((planet, i) => {
        const name = planetInfo[i].name;
        const data = orbitData[name];
        data.angle += data.speed;
        planet.position.x = Math.cos(data.angle) * data.distance;
        planet.position.z = Math.sin(data.angle) * data.distance;
      });
    }
    renderer.render(scene, camera);
  }
  
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  init();
  