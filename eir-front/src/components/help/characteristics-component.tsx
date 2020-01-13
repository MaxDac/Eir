import React from 'react';
import Characteristic from "../../dtos/characteristic";
import {DataComponentProps} from "../../base/base";
import {HelpServices} from "../../services/helpServices";
import './characteristics-component.css';
import {Card, CardBody, ListGroup, ListGroupItem, UncontrolledCollapse} from "reactstrap";

interface CharacteristicsComponentState {
    characteristics: Characteristic[];
}

export enum HelpType {
    Characteristics,
    Abilities
}

export interface CharacteristicsComponentProps extends DataComponentProps {
    type: HelpType;
}

export default class CharacteristicsComponent extends React.Component<CharacteristicsComponentProps, CharacteristicsComponentState> {
    constructor(props: any) {
        super(props);

        this.state = {
            characteristics: []
        };
    }

    componentDidMount() {
        const service = new HelpServices(this.props.getter);
        let promise;

        if (this.props.type === HelpType.Characteristics) {
            promise = service.getCharacteristics();
        } else {
            promise = service.getAbilities();
        }

        promise
            .then(x => {
                this.setState({
                    characteristics: x
                })
            });
    }

    render() {
        let rows = this.state.characteristics.map(c => (
            <ListGroupItem tag="a" href="#" action id={`toggler${c.id}`}>
                {c.name}
                <UncontrolledCollapse toggler={`#toggler${c.id}`}>
                    <Card>
                        <CardBody>
                            {c.comments}
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>
            </ListGroupItem>
            )
        );

        return(
            <div className="char-container">
                <ListGroup color="black">
                    {rows}
                </ListGroup>
            </div>
        )
    }
}
