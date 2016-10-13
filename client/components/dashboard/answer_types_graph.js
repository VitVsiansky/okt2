import React from "react";
import {Doughnut} from 'react-chartjs-2';
import {typography} from 'material-ui/styles';
import Paper from 'material-ui/Paper';

const styles = {
    title: {
        fontSize: 24,
        fontWeight: typography.fontWeightLight,
        marginBottom: 20,
        padding: 10
    }
};

class AnswerTypesGraph extends React.Component {

    getData() {
        if(this.props.data.datasets) {
           return (<Doughnut data={this.props.data}/>);
        }
    }

    render() {
        return (
            <Paper>
            <div>
                <div style={styles.title}>
                Odpovědi
                </div>
                {this.getData()}
            </div>
                </Paper>
        );
    }
}

export default AnswerTypesGraph;