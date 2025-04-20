const enum State {
    Nothing,
    Waiting,
    Search,
    SaveWhiteRefRaw,
    SaveBlackRefRaw,
    CalculateMedian,
    CalculationCompleted
}

function calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return null;
    numbers = numbers.sort((a, b) => a - b);
    const half = Math.floor(numbers.length / 2);
    return numbers.length % 2 ? numbers[half] : (numbers[half - 1] + numbers[half]) / 2;
}

function Main () {
    let state = State.Nothing;
    let fileName = "ref_raw_light_sensor.txt";

    // let nxtLightSensors: sensors.NXTLightSensor[] = [sensors.nxtLight1, sensors.nxtLight2, sensors.nxtLight3, sensors.nxtLight4]; // Массив всех портов датчиков отражения nxt
    let colorSensors: sensors.ColorSensor[] = [sensors.color1, sensors.color2, sensors.color3, sensors.color4]; // Массив всех портов датчиков цвета
    // let nxtLightSensorRefRaw: number[] = [0, 0, 0, 0]; // Массив для хранения сырых значений с датчика отражения nxt
    let colorSensorRefRaw: number[] = [0, 0, 0, 0]; // Массив для хранения сырых значений с датчика отражения nxt

    let whiteRefRawValues: number[][] = [[550], [540], [545], [510]]; // Массив для хранения сырых значений на белом
    let blackRefRawValues: number[][] = [[650], [640], [666], [656]]; // Массив для хранения сырых значений на чёрном

    let whiteRefRawMedianValues: number[] = [0, 0, 0, 0];
    let blackRefRawMedianValues: number[] = [0, 0, 0, 0];
    
    while (true) {
        // Считываем сырые значения с датчика отражения nxt
        // for (let i = 0; i < 4; i++) nxtLightSensorRefRaw[i] = nxtLightSensors[i].light(NXTLightIntensityMode.ReflectedRaw);
        for (let i = 0; i < 4; i++) colorSensorRefRaw[i] = colorSensors[i].light(LightIntensityMode.ReflectedRaw);

        if (state == State.Nothing && brick.buttonEnter.isPressed()) {
            state = State.Waiting;
        } else if (state == State.Waiting && !brick.buttonEnter.isPressed()) {
            state = State.Search;
        } else if (state == State.Search && brick.buttonUp.isPressed()) {
            state = State.SaveWhiteRefRaw;
            for (let i = 0; i < 4; i++) {
                whiteRefRawValues[i].push(colorSensorRefRaw[i]);
            }
            // console.log(colorSensorRefRaw.join(', '));
        } else if (state == State.Search && brick.buttonDown.isPressed()) {
            state = State.SaveBlackRefRaw;
            for (let i = 0; i < 4; i++) {
                blackRefRawValues[i].push(colorSensorRefRaw[i]);
            }
            // console.log(colorSensorRefRaw.join(', '));
        } else if ((state == State.SaveWhiteRefRaw || state == State.SaveBlackRefRaw) && !brick.buttonUp.isPressed() && !brick.buttonDown.isPressed()) {
            state = State.Search;
        } else if (state == State.Search && brick.buttonEnter.isPressed()) {
            state = State.CalculateMedian;
            for (let i = 0; i < 4; i++) {
                whiteRefRawMedianValues[i] = calculateMedian(whiteRefRawValues[i]);
                blackRefRawMedianValues[i] = calculateMedian(blackRefRawValues[i]);
            }
            storage.temporary.remove(fileName);
            storage.temporary.limit(fileName, 0);
            storage.temporary.appendLine(fileName, "White medians:");
            storage.temporary.appendLine(fileName, whiteRefRawMedianValues.join(', '));
            storage.temporary.appendLine(fileName, "Black medians:");
            storage.temporary.appendLine(fileName, blackRefRawMedianValues.join(', '));
        } else if (state == State.CalculateMedian) {
            state = State.CalculationCompleted;
        }

        // Выводим на экран
        brick.clearScreen();
        // for (let i = 0; i < 4; i++) brick.showValue("refRawPort" + (i + 1), nxtLightSensorRefRaw[i], i + 1);
        for (let i = 0; i < 4; i++) brick.showValue("refRawPort" + (i + 1), colorSensorRefRaw[i], i + 1);

        if (state == State.Nothing) {
            brick.printString("Press ENTER to search", 6);
            brick.printString("median values", 7);
        } else if (state == State.Search) {
            brick.printString("Press UP to save white", 6);
            brick.printString("Press DOWN to save black", 7);
            brick.printString("Press ENTER to calculate", 9);
            brick.printString("median values", 10);
        } else if (state == State.SaveWhiteRefRaw) {
            brick.printString("Saved to White!", 6);
        } else if (state == State.SaveBlackRefRaw) {
            brick.printString("Saved to Black!", 6);
        } else if (state == State.CalculateMedian) {
            brick.printString("Processing...", 9);
        } else if (state == State.CalculationCompleted) {
            brick.printString("White medians: ", 7);
            brick.printString(whiteRefRawMedianValues.join(', '), 8);
            brick.printString("Black medians: ", 10);
            brick.printString(blackRefRawMedianValues.join(', '), 11);
        }

        loops.pause(10); // Небольшая задержка для стабильности
    }
}

Main();