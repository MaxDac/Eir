import React from 'react';
import {Form, FormGroup, Input, Label} from "reactstrap";

export class SheetCreationComponent extends React.Component<any, any> {
    render() {
        return(
            <Form>
                <FormGroup>
                    <Label for="type">
                        Seleziona il tipo di personaggio:
                    </Label>
                    <Input type="select" name="type" id="type">
                        <option value="marziale">Marziale</option>
                        <option value="eclettico">Eclettico</option>
                        <option value="studioso">Studioso</option>
                    </Input>
                </FormGroup>
            </Form>
        )
    }
}
