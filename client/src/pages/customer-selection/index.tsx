import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Button from "../../components/button";
import CheckLoginToken from "../../components/check-login-token";
import LabeledTextInput from "../../components/labeled-text-input";
import Panel from "../../components/panel";
import PanelBody from "../../components/panel-body";
import PanelHeader from "../../components/panel-header";
import SimpleToast from "../../components/simple-toast";
import { useLoginToken } from "../../contexts/login-context";
import { useOrder, useSetOrder } from "../../contexts/order-context";
import { Color } from "../../util/Color";
import { findAndReplace } from "../../util/helpers";
import { Order } from "../../util/models";
import ListPropertiesLayout from "../setup/list-properties-layout";
import './style.css';

export default function CustomerSelection() {
    CheckLoginToken();

    const [customerList, setCustomerList] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>({});

    const [filter, setFilter] = useState("");
    const [message, setMessage] = useState("");
    const history = useHistory();
    const loginToken = useLoginToken();
    const order = useOrder();
    const setOrder = useSetOrder();

    const loadCustomers = () => {
        axios.post('/api/customer/list').then(result => {
            setCustomerList(result.data);
        })
    }

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
    }

    const createCustomerListItem = (customer, key) => {
        //build a display name
        let displayName = customer.firstName?customer.firstName:"";
        if(customer.lastName) {
            if(customer.firstName) {
                displayName += " "
            }
            displayName += customer.lastName;
        }
        if(customer.phone) {
            if(displayName) {
                displayName += " - ";
            }
            displayName += customer.phone;
        }

        if(!displayName) {
            displayName = "Unnamed Customer";
        }

        return (
            <Button
                key={key}
                style={{
                    width: "100%",
                    marginBottom: "3px",
                    display: filter?displayName.toLowerCase().includes(filter.toLocaleLowerCase())?"block":"none":"block"
                }}
                themeColor={customer===selectedCustomer?Color.kiwi_green:Color.sky_blue}
                onClick={() => {selectCustomer(customer)}}
            >
                {displayName}
            </Button>
        )
    }

    const addCustomer = () => {
        selectCustomer({});
    }

    const addCustomerToOrder = (customer) => {
        const newOrder = {
            ...order,
            Customers: [...(order.Customers?order.Customers:[]), customer]
        };

        setOrder((newOrder as Order));
    }

    let savingData = false;
    const saveAndOrder = async () => {
        //check the current order type and validate customer information for required fields
        if(order.type) {
            if(order.type === "Pick up") {
                //phone number must not be empty
                if(!selectedCustomer.phone) {
                    setMessage("You must enter a phone number");
                    return;
                }

            } else if (order.type === "Delivery") {
                //phone number must not be empty
                if(!selectedCustomer.phone) {
                    setMessage("You must enter a phone number");
                    return;
                }

                //address must not be empty
                if(!selectedCustomer.address) {
                    setMessage("You must enter an address");
                    return;
                }
            }
        }

        if(!savingData) {
            savingData = true;
            try{
                if(selectedCustomer.id) {
                    //update existing customer
                    await axios.post('/api/customer/update', {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: selectedCustomer
                    });
                    addCustomerToOrder(selectedCustomer);
                    history.push("/order");
                } else {
                    //create a new customer
                    const result = await axios.post('/api/customer/create', {
                        userId: loginToken.userId,
                        hash: loginToken.hash,
                        data: selectedCustomer
                    });

                    //update customer id
                    const newCustomer = {
                        ...selectedCustomer,
                        id: result.data.id
                    }
                    addCustomerToOrder(newCustomer);
                    history.push("/order");
                }
            } catch (err) {
                console.error(err);
                setMessage(err.stack);
            } finally {
                savingData = false;
            }
        } else {
            setMessage("Working... please wait.")
        }
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
            style: {gridArea: fieldName},
            value:selectedCustomer?(selectedCustomer[fieldName]?selectedCustomer[fieldName]:""):"",
            onChange:changeField(fieldName)
        }
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
                            <div className="customer-field-grid">
                                <LabeledTextInput {...createInputProps("firstName")} title="First Name"/>
                                <LabeledTextInput {...createInputProps("lastName")} title="Last Name"/>
                                <LabeledTextInput {...createInputProps("phone")} title="Phone Number"/>
                                <LabeledTextInput {...createInputProps("address")} title="Address"/>
                                <LabeledTextInput {...createInputProps("city")} title="City"/>
                                <LabeledTextInput {...createInputProps("state")} title="State"/>
                                <LabeledTextInput {...createInputProps("zip")} title="Zip"/>
                                <LabeledTextInput {...createInputProps("note")} title="Note"/>
                            </div>
                        </PanelBody>
                        <div className="d-flex flex-row-reverse">
                            <Button className="m-1" themeColor={Color.gray}
                                onClick={() => {
                                    history.goBack();
                                }}
                            >Exit</Button>
                            <Button className="m-1" themeColor={Color.kiwi_green}
                                onClick={saveAndOrder}
                            >Save and Order</Button>
                            <Button className="m-1" themeColor={Color.dark_gold}
                                onClick={addCustomer}
                            >Add Customer</Button>
                        </div>
                    </div>
                </ListPropertiesLayout>
            </Panel>
            <SimpleToast title="Message:" message={message} setMessage={setMessage}/>
        </Container>
    );
}