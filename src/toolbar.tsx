import * as React from 'react';

export interface ToolbarProps {
	properties: any
};

export interface ToolbarValueProps {
	value :string;
};

function Toolbar(props:ToolbarProps) {
	const style = {
			position: 'absolute' as 'absolute',
			width: '300px',
			right: '20px',
			top: '20px',
			bottom: '100px',
			backgroundColor: 'white',
			borderRadius: '10px',
			opacity: 0.9,
			textAlign: 'center' as const,
			padding: '15px'
		};
	return (<div style={style} >
					<Title value = {props.properties != null ? props.properties['address:address'] : ""}/>

				</div>
	);
}

export default Toolbar;

function Title(props: any) {
	return (<div><h2>{props.value}</h2></div>);
};


function Image(props: any) {
	const style = {
		width: '100%'
	}
	return (<img style={style} src={props.value} />)
}

function Text(props: any) {
	const style = {
		position: 'absolute' as 'absolute',
	    top: '290px',
	    left: '15px',
    	right: '15px',
	    bottom: '15px',
	    overflow: 'auto' as 'auto',
    	paddingRight: '5px',
	    textAlign: 'justify' as const
	}
	return (<div style={style}
				dangerouslySetInnerHTML={{__html: '&nbsp;&nbsp;&nbsp;&nbsp;' + props.value}}
			/>)
}
