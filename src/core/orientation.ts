export class Orientation {
  private static instance: Orientation

  
  static getInstance() {
    if (!this.instance) {
      this.instance = new Orientation()
    }
    
    return this.instance
  }
  
  #steeringAngle = 0; // Ângulo de direção atual (em graus)
  #maxSteeringAngle = 5; // Limite máximo de direção em graus
  #smoothingFactor = 0.1; // Fator para suavizar a rotação
  
  private constructor() {
    addEventListener('deviceorientation', this.#onDeviceOrientation)
  }
  

  
  #onDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma != null) {
      const maxTilt = 45; // Inclinação máxima considerada (em graus)

      // Calcula o ângulo de steering baseado na inclinação do dispositivo
      const targetAngle = (event.gamma / maxTilt) * this.#maxSteeringAngle;

      // Limita o ângulo dentro do intervalo permitido
      const clampedAngle = Math.max(-this.#maxSteeringAngle, Math.min(this.#maxSteeringAngle, targetAngle));

      // Suaviza a rotação com interpolação linear
      this.#steeringAngle += (clampedAngle - this.#steeringAngle) * this.#smoothingFactor;
    }
  }

  get steeringAngle() {
    return this.#steeringAngle;
  }
  
}
