import { IUnit } from './units/unit';

export interface UnitPackage{
    constructor: string;
    data: IUnit;
}

export interface PonderingData {
    unitPackage: UnitPackage;
    nearestUnitPackages: Array<UnitPackage>;
}
