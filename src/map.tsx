import * as React from 'react';
import InteractiveMap, {MapMouseEvent, NavigationControl} from 'react-map-gl';
import turfCentroid from '@turf/centroid';
import {featureCollection} from '@turf/helpers';
import {FeatureCollection, Feature, Polygon, MultiPolygon, Point} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import {CityBoundaryLayer, BuildingsLayer} from './layers';
// import MapiClient from "@mapbox/mapbox-sdk/lib/classes/mapi-client";
import mbxDatasets from "@mapbox/mapbox-sdk/services/datasets";

const accessToken = "pk.eyJ1Ijoia2xuNCIsImEiOiJjaW9sNjZlbWMwMDEwdzVtNmxxYjA2ZGozIn0.BytaphQwtjCVMGEaLlfb3Q";
const MapiClient = require('@mapbox/mapbox-sdk')
// const mapiClient = new MapiClient({accessToken})
const mapiClient = new MapiClient({accessToken})
const datasetService = mbxDatasets(mapiClient);

const mapProperties = {
    longitude: 37.420573,
    latitude: 55.737134,
    zoom: 12,
    pitch: 60,
    bearing: 0
}

const styleId = 'mapbox://styles/kln4/cl65cx61a000c15ljmv271d6d';
const boundaryDatasetId = 'cly4bv93305ub1mocq5fyf8uq';
const buildingDatasetId = 'cly4jnyos8ybp1tnx9skz7oi6';

export interface GpMapProps {
    onClick: any;
}

export interface GpMapState {
    boundary: FeatureCollection<Polygon | MultiPolygon>;
    buildings: FeatureCollection<Polygon | MultiPolygon>;
    clickedBuilding: Feature<Polygon | MultiPolygon> | null;
    hoveredBuilding: Feature<Polygon | MultiPolygon> | null;
    buildingCentroids: Feature<Point>[];
}

export default class GpMap extends React.Component<GpMapProps, GpMapState> {
    constructor(props: GpMapProps) {
        super(props);
        this.state = {
            boundary: featureCollection([]),
            buildings: featureCollection([]),
            clickedBuilding: null,
            hoveredBuilding: null,
            buildingCentroids: []
        };
    }

    public componentDidMount() {
        datasetService
            .listFeatures({datasetId: boundaryDatasetId})
            .send()
            .then(
                response => {
                    let boundary: FeatureCollection<Polygon | MultiPolygon> = response.body
                    this.setState({boundary: boundary})
                },
                error => console.log(error)
            )
        datasetService
            .listFeatures({datasetId: buildingDatasetId})
            .send()
            .then(
                response => {
                    let buildings: FeatureCollection<Polygon | MultiPolygon> = response.body
                    let buildingFeatures = buildings.features
                    let buildingCentroidFeatures = buildingFeatures
                        .map(feature => turfCentroid(feature))
                    this.setState({
                        buildings: buildings,
                        buildingCentroids: buildingCentroidFeatures
                    })
                },
                error => console.log(error)
            )
    }

    private handleBuildingsEnter = (event: MapMouseEvent) => {
        let feature = event?.features?.find(f => f.layer.id === 'buildings') || null
        this.setState({hoveredBuilding: feature});
    }

    private handleBuildingsLeave = () => {
        this.setState({hoveredBuilding: null});
    }

    private handleBuildingsClick = (event: MapMouseEvent) => {
        let feature = event?.features?.find(f => f.layer.id === 'buildings') || null

        if (feature == null) {
            this.props.onClick(null)
            this.setState({clickedBuilding: null});
        } else {
            this.props.onClick(feature.properties)
            this.setState({clickedBuilding: feature});
        }
    }

    public render() {
        return (
            <InteractiveMap
                mapboxAccessToken={accessToken}
                initialViewState={mapProperties}
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%'
                }}
                mapStyle={styleId}
                interactiveLayerIds={["buildings"]}
                onClick={this.handleBuildingsClick}
                onMouseEnter={this.handleBuildingsEnter}
                onMouseLeave={this.handleBuildingsLeave}
            >
                <NavigationControl/>
                <CityBoundaryLayer featureCollection={this.state.boundary}/>
                <BuildingsLayer
                    featureCollection={this.state.buildings}
                    clickedBuilding={this.state.clickedBuilding}
                    hoverBuildings={this.state.hoveredBuilding}
                />
            </InteractiveMap>
        )
    }
}
