import { Unit, IUnit, UnitPackage } from '../models/units/unit';

export interface UnitMapper {
    name: string;
    new (unit: IUnit): Unit;
}

export class UnitMapperList {
    private mappers: Map<string, UnitMapper> = new Map();

    constructor(mappers?: Array<UnitMapper>) {
        if (mappers) {
            mappers.forEach(mapper => this.add(mapper));
        }
    }

    add(mapper: UnitMapper): void {
        this.mappers.set(mapper.name, mapper);
    }

    map(unitPackage: UnitPackage): Unit {
        if (!this.mappers.has(unitPackage.constructor)) {
            throw new Error(`Attempt to get not existed mapper: ${unitPackage.constructor}`);
        }
        const unitMapper = this.mappers.get(unitPackage.constructor);
        const unit = new unitMapper(unitPackage.data);
        return unit;
    }
}
