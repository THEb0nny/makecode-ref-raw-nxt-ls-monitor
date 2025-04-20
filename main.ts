function Main () {
    let nxtLightSensor: sensors.NXTLightSensor[] = [sensors.nxtLight1, sensors.nxtLight2, sensors.nxtLight3, sensors.nxtLight4]; // Массив всех портов датчиков отражения nxt
    let nxtLightSensorRefRaw: number[] = [0, 0, 0, 0]; // Массив для хранения сырых значений с датчика отражения nxt

    let whiteRefRawValues: number[][] = []; // Массив для хранения сырых значений на белом
    let blackRefRawValues: number[][] = []; // Массив для хранения сырых значений на чёрном
    
    while (true) {
        // Считываем сырые значения с датчика отражения nxt
        for (let i = 0; i < 4; i++) nxtLightSensorRefRaw[0] = nxtLightSensor[i].light(NXTLightIntensityMode.ReflectedRaw);
        // Выводим на экран
        brick.clearScreen();
        for (let i = 0; i < 4; i++) brick.showValue("refRawPort" + (i + 1), nxtLightSensorRefRaw[0], i + 1);

        brick.printString("Press UP to save white", 6);
        brick.printString("Press DOWN to save black", 7);
        brick.printString("Press ENTER to calculate", 8);
        brick.printString("median values", 9);

        // Запись значений при нажатии кнопок
        if (brick.buttonUp.isPressed()) { // Копируем текущие значения в массив для белого
            whiteRefRawValues.push(nxtLightSensorRefRaw);
            console.log(nxtLightSensorRefRaw.join(', '));
            brick.printString("Saved to White!", 11);
            while (brick.buttonUp.isPressed()) loops.pause(0.001);
            // loops.pause(250); // Задержка для предотвращения многократного срабатывания
        } else if (brick.buttonDown.isPressed()) { // Копируем текущие значения в массив для чёрного
            blackRefRawValues.push(nxtLightSensorRefRaw);
            console.log(nxtLightSensorRefRaw.join(', '));
            brick.printString("Saved to Black!", 11);
            while (brick.buttonDown.isPressed()) loops.pause(0.001);
            // loops.pause(250); // Задержка для предотвращения многократного срабатывания
        }

        if (brick.buttonEnter.isPressed()) {
            // Действие при нажатии Enter (можно добавить обработку массивов)
            brick.printString("Processing...", 11);
            loops.pause(500);
        }

        loops.pause(10); // Небольшая задержка для стабильности
    }
}

Main();