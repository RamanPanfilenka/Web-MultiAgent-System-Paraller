export interface UnitPackage{
    constructor: string;
    data: any;
}

export interface PonderingData {
    unitPackage: UnitPackage;
    nearestUnitPackages: Array<UnitPackage>;
}