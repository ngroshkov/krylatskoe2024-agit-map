import * as React from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfDifference from '@turf/difference';

export interface CityBoundaryLayerProps {
	features: GeoJSON.Feature<GeoJSON.GeometryObject>[];
}

function CityBoundaryLayer(props: CityBoundaryLayerProps) {
	let feature: any  = props.features[0];
	let bounds = turfBboxPolygon([180, 90, -180, -90]);
	let boundary = turfDifference(bounds, feature);
	return (<GeoJSONLayer
				data={boundary}
				fillPaint={{
					"fill-color": "grey",
					"fill-opacity": 0.8,
					"fill-outline-color": "red"
				}}/>);
}

export interface BuildingsLayerProps {
	features: GeoJSON.Feature<GeoJSON.GeometryObject>[];
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
						'property': 'level',
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

export { CityBoundaryLayer, BuildingsLayer }
