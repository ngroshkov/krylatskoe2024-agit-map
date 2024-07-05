import * as React from 'react';
import {GeoJSONLayer} from 'react-mapbox-gl';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfDifference from '@turf/difference';
import {featureCollection} from '@turf/helpers';
import {Feature, Polygon, MultiPolygon, GeometryObject} from 'geojson';

export interface CityBoundaryLayerProps {
    features: Feature<Polygon | MultiPolygon>[];
}

function CityBoundaryLayer(props: CityBoundaryLayerProps) {
    let feature = props.features[0];
    let bounds = turfBboxPolygon([180, 90, -180, -90]);
    let features = featureCollection([bounds, feature])
    let boundary = turfDifference(features);
    return (<GeoJSONLayer
        data={boundary}
        fillPaint={{
            "fill-color": "grey",
            "fill-opacity": 0.8,
            "fill-outline-color": "red"
        }}/>);
}

export interface BuildingsLayerProps {
    features: Feature<Polygon | MultiPolygon>[];
    opacity: number;
    onBuildingsMouseEnter?: any;
    onBuildingsMouseLeave?: any;
    onBuildingsClick?: any;
}

function BuildingsLayer(props: BuildingsLayerProps) {
    return (<GeoJSONLayer
        data={{
            'type': 'FeatureCollection',
            'features': props.features
        }}
        fillExtrusionPaint={{
            'fill-extrusion-color': {
                'property': 'color',
                'type': 'identity'
            },
            'fill-extrusion-height': {
                'property': 'building:level',
                'type': 'identity'
            },
            'fill-extrusion-base': {
                'property': 'base_height',
                'type': 'identity'
            },
            'fill-extrusion-opacity': props.opacity
        }}
        fillExtrusionOnMouseEnter={props.onBuildingsMouseEnter}
        fillExtrusionOnMouseLeave={props.onBuildingsMouseLeave}
        fillExtrusionOnClick={props.onBuildingsClick}
    />);
}

export interface BuildingCentroidsLayerProps {
    features: Feature<GeometryObject>[];
    symbol?: boolean;
    circle?: boolean;
}

function BuildingCentroidsLayer(props: BuildingCentroidsLayerProps) {
    let symbolLayout = props.symbol ? {
        'text-field': {
            'property': 'contacts_count',
            'type': 'identity'
        },
        'text-font': [
            'literal',
            ['Arial Unicode MS Bold']
        ],
        'text-size': 10
    } : null
    let symbolPaint = props.symbol ? {
        'text-color': ['case', ['==', ['get', 'contacts_count'], 0], 'red', 'black']
    } : null
    let circlePaint = props.circle ? {
        'circle-color': "#FFFFFF",
        'circle-radius': 7,
        'circle-stroke-color': "black",
        'circle-stroke-width': 0.5,
    } : null

    return (<GeoJSONLayer
        data={{
            'type': 'FeatureCollection',
            'features': props.features
        }}
        symbolLayout={symbolLayout}
        symbolPaint={symbolPaint}
        circlePaint={circlePaint}
    />);
}

export {CityBoundaryLayer, BuildingsLayer, BuildingCentroidsLayer}
