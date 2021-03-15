import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Button from "../../components/button";
import LabeledTextInput from "../../components/labeled-text-input";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";
import PanelHeader from "../../components/panel-header";
import SimpleToast from "../../components/simple-toast";
import { useLoginToken } from "../../contexts/login-context";
import { Color } from "../../util/Color";
import { findAndReplace } from "../../util/helpers";
import ListPropertiesLayout from "../setup/list-properties-layout";

export default function CustomerSelection() {
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any|null>(null);

    const [filter, setFilter] = useState("");
    const [message, setMessage] = useState("");
    const history = useHistory();
    const loginToken = useLoginToken();

    const loadCustomers = () => {
        axios.post('/api/customer/list').then(result => {
            setCustomerList(result.data);
        })
    }

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
    }

    const createCustomerListItem = (customer, key) => {
        const displayName = `${customer.firstName} ${customer.lastName}${customer.phone?" - " + customer.phone:""}`;
        return (
            <Button
                key={key}
                style={{
                    width: "100%",
                    marginBottom: "3px",
                    display: filter?displayName.toLowerCase().includes(filter.toLocaleLowerCase())?"block":"none":"block"
                }}
                onClick={() => {selectCustomer(customer)}}
            >
                {displayName}
            </Button>
        )
    } 

    const saveAndOrder = () => {
        //TODO:
    }
    
    const updateCustomer = (targetCustomer, newCustomer) => {
        const newCustomerList = findAndReplace(customerList, targetCustomer, newCustomer);
        if(newCustomerList) {
            setCustomerList(newCustomerList);
        }
        selectCustomer(newCustomer);
    }

    const changeField = (fieldName) => {
        return (event) => {
            const newCustomer = {
                ...selectedCustomer
            };
            newCustomer[fieldName] = event.target.value;
            updateCustomer(selectedCustomer, newCustomer);
        }
    }

    const createInputProps = (fieldName) => {
        return {
            value:selectedCustomer?(selectedCustomer[fieldName]?selectedCustomer[fieldName]:""):"",
            onChange:changeField(fieldName)
        }
    }

    const CustomerFieldInput = ({fieldName, title, style={}}) => {
        return (
            <LabeledTextInput title={title}
                style={style}
                value={selectedCustomer?(selectedCustomer[fieldName]?selectedCustomer[fieldName]:""):""}
                onChange={changeField(fieldName)}
            ></LabeledTextInput>
        );
    }

    useEffect(() => {
        loadCustomers();
    }, []);

    return (
        <Container className="vh-100 position-relative py-3">
            <Panel className="w-100 h-100 d-flex flex-column">
                <PanelHeader>
                    Customer
                </PanelHeader>
                <ListPropertiesLayout>
                    <div className="d-flex flex-column h-100">
                        <LabeledTextInput className="m-1" title="Filter" value={filter} labelColorTheme={Color.gold}
                            onChange={(e) => {setFilter(e.target.value)}} labelStyle={{width: "4em", textAlign: "center"}}/>
                        <PanelBody className="flex-grow-1 overflow-auto" style={{flexBasis: 0}}>
                            {customerList.map((customer, index) => createCustomerListItem(customer, index))}
                        </PanelBody>
                    </div>
                    <div className="d-flex flex-column h-100">
                        <PanelBody className="flex-grow-1">
                            <LabeledTextInput {...createInputProps("firstName")} title="First Name"/>
                            <LabeledTextInput {...createInputProps("lastName")} title="Last Name"/>
                            <LabeledTextInput {...createInputProps("phone")} title="Phone Number"/>
                            <LabeledTextInput {...createInputProps("address")} title="Address"/>
                            <LabeledTextInput {...createInputProps("city")} title="City"/>
                            <LabeledTextInput {...createInputProps("state")} title="State"/>
                            <LabeledTextInput {...createInputProps("zip")} title="Zip"/>
                            <LabeledTextInput {...createInputProps("note")} title="Note"/>
                        </PanelBody>
                        <div className="d-flex flex-row-reverse">
                            <Button className="m-1" style={{fontSize: "1.2em", width:"4em"}} themeColor={Color.gray}
                                onClick={() => {
                                    history.goBack();
                                }}
                            >Exit</Button>
                        </div>
                    </div>
                </ListPropertiesLayout>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}