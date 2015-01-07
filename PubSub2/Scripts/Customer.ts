///<reference path='PubSub.ts' /> 

/**
Customer.ts 

This file contain the model for the customer class for vantage 
*/

module Vantage {
    export enum AddressType {
        Billing,
        Shipping,
        Primary

    }



    export class Address {
        public addressID: string;
        public addresstypecode: AddressType;
        public country: string = 'USA';
        public line1: string;
        public line2: string;
        public line3: string;
        public postalCode: string;
    }
    export class Customer {
        public ID: number;
        public firstName: string;
        public lastName: string;
        public workPhone: string;
        public homePhone: string;
        //public Addresses: Array<Address>; 
        //public primaryAddress: Address;      
    }

    export module Topics{
        export function GetCustomer() {
            return {
                request: "GetCustomers",
                response: "Customers"
            };
        }
        export function EditCustomers() {
            return {
                request : "CustomerEdit"
            }
        }
        export function NewCustomers() {
            return {
                request: "NewCustomer"
            }
        }
    }

    export class EditCustomerResponse {
        private _success: boolean;
        private _message: string; 
        constructor(succcess: boolean, message?: string) {
            if (message) {
                this._message = message
            }
            this._success = succcess; 
        }

        public get success() : boolean{
            return this._success;
        }

        public get message(): string {
            return this._message; 
        }
    }


    export class CustomerStore {
        private queue: PubSub.PubSubQueue;
        private customers: Array<Customer>;

        constructor(publisher: PubSub.PubSubQueue) {
            this.queue = publisher;
            this.customers = new Array<Customer>(); 

            this.queue.AddSubscription(Topics.NewCustomers().request, (msg) => { this.AddCustomer(msg); });
            this.queue.AddSubscription(Topics.EditCustomers().request, (msg) => { this.EditCustomer(msg); });
            this.queue.AddSubscription(Topics.GetCustomer().request, (msg) => { this.GetCustomers(msg) ; });

        }

        private AddCustomer(newCust: Customer) {
            this.customers.push(newCust);
            this.GetCustomers({});
        }

        private EditCustomer(custInfo: { editedCust: Customer; resposeTopic?: string }) {
            //Return the customers that are not the edited one
            var len = this.customers.length;
            var foundIndex;
            for (var x = 0; x < len; x++) {
                if (this.customers[x].ID === custInfo.editedCust.ID) {
                    foundIndex = x;
                    break;
                }
            }
            
            //Caller has requested a response 
            if (foundIndex === undefined) {
                //The item was not found and this is an error report it of the caller requested response
                var resp = new EditCustomerResponse(false, "Customer Not Found");
                this.queue.Publish(custInfo.resposeTopic, EditCustomerResponse);
                if (custInfo.resposeTopic) {
                    this.queue.Publish(custInfo.resposeTopic, resp); 
                }
                return; 
            }                           
            this.customers[x] = custInfo.editedCust;              
            if (custInfo.resposeTopic) {
                var resp = new EditCustomerResponse(true); 
                this.queue.Publish(custInfo.resposeTopic, resp); 
            }
            this.GetCustomers({}); 
        }

        private GetCustomers(GetCustomerCritera: { returnTopic?: string }) {
            var publishTopic = GetCustomerCritera.returnTopic ? GetCustomerCritera.returnTopic : Topics.GetCustomer().response;
            this.queue.Publish(publishTopic, this.customers);
        }

    }
}