import { Unit, IUnit } from './units/unit';
import { UnitPackage } from './ponderingData';

export interface UnitMapper {
    name: string;
    new (unit: IUnit): Unit;
}

export class UnitMapperList {
    private mappers: Map<string, UnitMapper> = new Map();

    constructor(mappers: Array<UnitMapper>) {
        mappers.forEach(mapper => this.add(mapper));
    }

    add(mapper: UnitMapper): void {
        this.mappers.set(mapper.name, mapper);
    }

    map(unitPackage: UnitPackage): Unit {
        const unitMapper = this.mappers.get(unitPackage.constructor);
        const unit = new unitMapper(unitPackage.data);        return unit;
    }
}
