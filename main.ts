const enum State {
    Nothing,
    Waiting,
    Search,
    SaveWhiteRefRaw,
    SaveBlackRefRaw,
    CalculateMedian,
    CalculationCompleted
}

function calculateMedian(numbers: number[]): number | null {
    if (numbers.length === 0) return null;

    const sorted = numbers.sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);

    return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
}

function Main () {
    let state = State.Nothing;

    // let nxtLightSensors: sensors.NXTLightSensor[] = [sensors.nxtLight1, sensors.nxtLight2, sensors.nxtLight3, sensors.nxtLight4]; // Массив всех портов датчиков отражения nxt
    let colorSensors: sensors.ColorSensor[] = [sensors.color1, sensors.color2, sensors.color3, sensors.color4]; // Массив всех портов датчиков цвета
    // let nxtLightSensorRefRaw: number[] = [0, 0, 0, 0]; // Массив для хранения сырых значений с датчика отражения nxt
    let colorSensorRefRaw: number[] = [0, 0, 0, 0]; // Массив для хранения сырых значений с датчика отражения nxt

    let whiteRefRawValues: number[][] = []; // Массив для хранения сырых значений на белом
    let blackRefRawValues: number[][] = []; // Массив для хранения сырых значений на чёрном
    
    while (true) {
        // Считываем сырые значения с датчика отражения nxt
        // for (let i = 0; i < 4; i++) nxtLightSensorRefRaw[i] = nxtLightSensors[i].light(NXTLightIntensityMode.ReflectedRaw);
        for (let i = 0; i < 4; i++) colorSensorRefRaw[i] = colorSensors[i].light(LightIntensityMode.ReflectedRaw);
        // Выводим на экран
        brick.clearScreen();
        // for (let i = 0; i < 4; i++) brick.showValue("refRawPort" + (i + 1), nxtLightSensorRefRaw[i], i + 1);
        for (let i = 0; i < 4; i++) brick.showValue("refRawPort" + (i + 1), colorSensorRefRaw[i], i + 1);

        if (state == State.Nothing && brick.buttonEnter.isPressed()) {
            state = State.Waiting;
        } else if (state == State.Waiting && !brick.buttonEnter.isPressed()) {
            state = State.Search;
        } else if (state == State.Search && brick.buttonUp.isPressed()) {
            state = State.SaveWhiteRefRaw;
            whiteRefRawValues.push(colorSensorRefRaw);
            console.log(colorSensorRefRaw.join(', '));
        } else if (state == State.Search && brick.buttonDown.isPressed()) {
            state = State.SaveBlackRefRaw;
            blackRefRawValues.push(colorSensorRefRaw);
            console.log(colorSensorRefRaw.join(', '));
        } else if ((state == State.SaveWhiteRefRaw || state == State.SaveBlackRefRaw) && !brick.buttonUp.isPressed() && !brick.buttonDown.isPressed()) {
            state = State.Search;
        } else if (state == State.Search && brick.buttonEnter.isPressed()) {
            state = State.CalculateMedian;
            const medians = whiteRefRawValues.map(calculateMedian);
            console.log(medians.join(', '));
        } else if (state == State.CalculateMedian) {
            state = State.CalculationCompleted;
        }

        if (state == State.Nothing) {
            brick.printString("Press ENTER to search", 6);
            brick.printString("median values", 7);
        } else if (state == State.Search) {
            brick.printString("Press UP to save white", 6);
            brick.printString("Press DOWN to save black", 7);
            brick.printString("Press ENTER to calculate", 9);
            brick.printString("median values", 10);
        } else if (state == State.SaveWhiteRefRaw) {
            brick.printString("Saved to White!", 12);
        } else if (state == State.SaveBlackRefRaw) {
            brick.printString("Saved to Black!", 12);
        } else if (state == State.CalculateMedian) {
            brick.printString("Processing...", 9);
        } else if (state == State.CalculationCompleted) {

        }

        loops.pause(10); // Небольшая задержка для стабильности
    }
}

Main();