import {ArcLayer} from "@deck.gl/layers";
import {Feature} from "geojson";
import Color from "color";

export class ElectionCommissionBuilding {
    color: [number, number, number];
    uik: { coordinates: [number, number] };
    building: { coordinates: [number, number] };

    constructor(feature: Feature) {
        const color = Color(feature?.properties?.color || "#000000").rgb().array()
        let lon = feature?.properties?.lon || 0
        let lat = feature?.properties?.lat || 0
        let uikLon = feature?.properties?.uik_lon || 0
        let uikLat = feature?.properties?.uik_lat || 0

        this.color = color as [number, number, number]
        this.uik = {coordinates: [uikLon, uikLat]}
        this.building = {coordinates: [lon, lat]}
    }
}

export class ElectionCommissionBuildingLayer extends ArcLayer<ElectionCommissionBuilding> {
    constructor(uikBuildings: Array<ElectionCommissionBuilding>) {
        super({
                id: 'electionCommissionBuildingLayer',
                data: uikBuildings,
                getSourcePosition: (d: ElectionCommissionBuilding) => d.uik.coordinates,
                getTargetPosition: (d: ElectionCommissionBuilding) => d.building.coordinates,
                getSourceColor: (d: ElectionCommissionBuilding) => d.color,
                getTargetColor: (d: ElectionCommissionBuilding) => d.color,
                getWidth: 2,
                getHeight: 0.5,
                opacity: 0.5,
            }
        );
    }
}