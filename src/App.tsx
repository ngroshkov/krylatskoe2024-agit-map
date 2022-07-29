import React from 'react';
import logo from './logo.svg';
import './App.css';
import GpMap from './map';
import Toolbar from './toolbar';
import Description, {descriptions} from './data/descriptions';

export interface AppProps {
}

export interface AppState {
	properties: any
}

class App extends React.Component<AppProps, AppState> {
	constructor(props : AppProps) {
		super(props);
		this.state = {
			properties: null
		};
	}


	private handleClick = (properties: any) => {
		this.setState({properties:properties})
		// if (properties == null) {
		// 	this.setState({description:descriptions[0]})
		// } else {
		// 	let foundDescriptions = descriptions.filter(o => o.id === id);
		// 	if (foundDescriptions.length === 0) {
		// 		this.setState({description:descriptions[0]})
		// 	} else {
		// 		this.setState({description:foundDescriptions[0]})
		// 	}
		// }
	}

	public render() {
		const style = {
			backgroundColor: '#D7DADB',
			height: '100%',
		}
		return <div style={style}>
          <GpMap onClick={(id: number) => this.handleClick(id)}/>
					<Toolbar properties={this.state.properties}/>
				</div>
	}
}

export default App;
