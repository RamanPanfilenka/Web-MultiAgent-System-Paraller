import { UnitPackage } from './units/unit';

export interface PonderingData {
    unitPackage: UnitPackage;
    nearestUnitPackages: Array<UnitPackage>;
}
