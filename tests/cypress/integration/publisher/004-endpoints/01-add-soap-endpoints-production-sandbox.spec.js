/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Utils from "@support/utils";

describe("Add production sandbox endpoints for SOAP", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        cy.loginToPublisher(publisher, password);
    })

    it.only("Add production sandbox endpoints for SOAP", () => {
        const endpoint = 'https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php?wsdl';
        cy.createAPIWithoutEndpoint();
        cy.get('#itest-api-details-api-config-acc').click();
        cy.get('#left-menu-itemendpoints').click();
        cy.get('[data-testid="http/soapendpoint-add-btn"]').click();

        // Add the prod and sandbox endpoints
        cy.get('#production-endpoint-checkbox').click();
        cy.get('#sandbox-endpoint-checkbox').click();
        cy.get('#production_endpoints').focus().type(endpoint);
        cy.get('#sandbox_endpoints').focus().type(endpoint);

        // Save
        cy.get('body').click();
        cy.get('#endpoint-save-btn').scrollIntoView();
        cy.get('#endpoint-save-btn').click();

        // Check the values
        cy.get('#production_endpoints').should('have.value', endpoint);
        cy.get('#sandbox_endpoints').should('have.value', endpoint);

    });

    after(function () {
        // Test is done. Now delete the api
        cy.get('#itest-id-deleteapi-icon-button').click({force:true});
        cy.get('#itest-id-deleteconf').click();

        cy.visit(`${Utils.getAppOrigin()}/carbon/user/user-mgt.jsp`);
        cy.deleteUser(publisher);
    })
});