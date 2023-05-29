#!/usr/bin/env node
import _ from 'lodash'
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fileName = process.argv[2];
const content = fs.readFileSync(path.join(
  __dirname,
  fileName
), 'utf-8');

// BEGIN
const data = content
  .split('\n')
  .map((unit) => unit.split('|').slice(1, -1))
  .map((unit) => {
    const obj = {
      name: unit[0].trim(),
      power: unit[1].trim(),
      health: unit[2].trim(),
      count: unit[3].trim(),
      avgHeight: unit[4].trim(),
      avgWeight: unit[5].trim(),
      value: unit[6].trim(),
    };
    return obj;
  })
  .slice(1);

//step 1
console.log(`Количество уникальных юнитов: ${data.length}`);

//step 2
const unitValue = data.map(({value}) => Number(value));
const sortedUnitsValue = _.uniq(unitValue).sort((a, b) => {return b - a});
console.log(`Стоимость 10 сильнейших юнитов: ${sortedUnitsValue[0] * 10}. Стоимость 20 вторых по силе юнитов: ${sortedUnitsValue[1] * 20}`);

//step 3
const unitHealth = data.map(({health}) => Number(health)).sort((a, b) => {return b - a});
const weaknestUnit = data.filter((unit) => String(unitHealth.at(-1)) === unit.health).map(({count, value}) => Number(value) * Number(count));
const strongestUnit = data.filter((unit) => String(unitHealth[0]) === unit.health).map(({count, value}) => Number(value) * Number(count));
console.log(`Стоимость найма отряда хилых: ${weaknestUnit}. Стоимость найма отряда жировиков: ${strongestUnit}`);

//step 4
const avgPowerValue = data.map(({value, power}) => Number(value) / Number(power)).sort((a, b) => {return b - a});
const powerValue = data.filter(({power, value}) => avgPowerValue[0] === Number(value/power) || avgPowerValue.at(-1) === Number(value/power));
const end = powerValue.map(({name}) => name);
console.log(`Наименее выгодный юнит: ${end[1]}. Наиболее выгодный юнит: ${end[0]}`);

// END