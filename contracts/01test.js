var NotarHelpers = artifacts.require("NotarHelpers.sol");
var OneSideAgreement = artifacts.require("OneSideAgreement.sol");
var AgreementFactory = artifacts.require("AgreementFactory.sol");

chai = require("chai");
chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

expect = chai.expect;

contract("Test the contracts", function(accounts){
    describe("Deploy the NotarHelpers smart contract", function(){
        it("Catch the instance of the NotarHelpers contract", function(){
            return NotarHelpers.new().then(function(instance){
                notarHelpersContract = instance;
            })
        })
    })

    describe("Add new notary", function(){
        it("Add the first one", function(){
            return notarHelpersContract.AddNotar(accounts[1]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check that exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[1]).then(function(res){
                expect(res).to.be.equal(true);
            })
        })

        it("Add another one", function(){
            return notarHelpersContract.AddNotar(accounts[2]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check that exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[2]).then(function(res){
                expect(res).to.be.equal(true);
            })
        })

        it("Add another notary from other address (impossible)", function(){
            return expect(notarHelpersContract.AddNotar(accounts[3], {"from": accounts[2]})).to.be.eventually.rejected;
        })

        it("Check that doesn't exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[3]).then(function(res){
                expect(res).to.be.equal(false);
            })
        })
    })

    describe("Delete notary", function(){
        it("Delete existing element", function(){
            return notarHelpersContract.DeleteNotar(accounts[1]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        });

        it("Check that doesn't exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[1]).then(function(res){
                expect(res).to.be.equal(false);
            })
        })

        it("Delete non-existing element", function(){
            return notarHelpersContract.DeleteNotar(accounts[3]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        });

        it("Check that doesn't exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[3]).then(function(res){
                expect(res).to.be.equal(false);
            })
        })

        it("Delete exisiting from another account (impossible)", function(){
            return expect(notarHelpersContract.DeleteNotar(accounts[2], {"from": accounts[2]})).to.be.eventually.rejected;
        })

        it("Check that exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[2]).then(function(res){
                expect(res).to.be.equal(true);
            })
        })
    })

    describe("Am I notary check", function(){
        it("I am", function(){
            return notarHelpersContract.AmINotar({"from" : accounts[2]}).then(function(res){
                expect(res).to.be.equal(true);
            })
        })

        it("I am not", function(){
            return notarHelpersContract.AmINotar({"from" : accounts[1]}).then(function(res){
                expect(res).to.be.equal(false);
            })
        })
    })

    describe("Deploy the OneSideAgreement smart contract (to certify)", function(){
        it("Check that exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[2]).then(function(res){
                expect(res).to.be.equal(true);
            })
        })
        
        it("Catch the instance of the OneSideAgreement contract", function(){
            
            return OneSideAgreement.new(accounts[2], "0x123", [accounts[5], accounts[6]]).then(function(instance){
                oneSideAgreementContract = instance;
            })
        })

        it("Check that in progress", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(true);
            })
        })
    })

    describe("Check getting info", function(){
        it("Get notary", function(){
            return oneSideAgreementContract.GetNotar().then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check notary", function(){
            return oneSideAgreementContract.GetNotar().then(function(res){
                expect(res).to.be.equal(accounts[2]);
            })
        })

        it("Get data", function(){
            return oneSideAgreementContract.GetData().then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check data", function(){
            return oneSideAgreementContract.GetData().then(function(res){
                expect(res.toString()).to.be.equal("0x1230000000000000000000000000000000000000000000000000000000000000");
            })
        })

        it("Get client", function(){
            return oneSideAgreementContract.GetClient().then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Get status", function(){
            return oneSideAgreementContract.CheckStatus().then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check if status is 'in progress'", function(){
            return oneSideAgreementContract.CheckStatus().then(function(res){
                expect(res.toString()).to.be.equal("In progress");
            })
        })

        it("Get benefitiars", function(){
            return oneSideAgreementContract.GetBenefitiars().then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("2 benefitiars", function(){
            return oneSideAgreementContract.GetBenefitiars().then(function(res){
                expect(res.length).to.be.equal(2);
            })
        })
    })

    describe("Check notary functions (certify)", function(){
        /*it("Certify not by notary (impossible)", function(){
            return expect(oneSideAgreementContract.Certify({"from" : accounts[5]})).to.be.eventually.rejected;
        })*/

        it("Certify not by notary", function(){
            return oneSideAgreementContract.Certify({"from" : accounts[5]}).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check that in progress", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(true);
            })
        })

        it("Certify by notary", function(){
            return oneSideAgreementContract.Certify({"from" : accounts[2]}).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check if status is 'certified'", function(){
            return oneSideAgreementContract.CheckStatus().then(function(res){
                expect(res.toString()).to.be.equal("Certified");
            })
        })

        it("Check if 'in progress' is false", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(false);
            })
        })

        

        /*it("Deny by notary (impossible)", function(){
            return expect(oneSideAgreementContract.Deny({"from" : accounts[2]})).to.be.eventually.rejected;
        })*/

        it("Deny by notary", function(){
            return oneSideAgreementContract.Deny({"from" : accounts[2]}).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check if status is still 'certified'", function(){
            return oneSideAgreementContract.CheckStatus().then(function(res){
                expect(res.toString()).to.be.equal("Certified");
            })
        })

        it("Check if 'in progress' is still false", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(false);
            })
        })

        it("Check if 'is cerified' is still true", function(){
            return oneSideAgreementContract.isCertified().then(function(res){
                expect(res).to.be.equal(true);
            })
        })
    })

    describe("Deploy the OneSideAgreement smart contract (to deny)", function(){
        it("Check that exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[2]).then(function(res){
                expect(res).to.be.equal(true);
            })
        })
        
        it("Catch the instance of the OneSideAgreement contract", function(){
            
            return OneSideAgreement.new(accounts[2], "0x228", [accounts[5], accounts[6]]).then(function(instance){
                oneSideAgreementContract = instance;
            })
        })

        it("Check that in progress", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(true);
            })
        })
    })

    describe("Check notary functions (deny)", function(){
        /*it("Certify not by notary (impossible)", function(){
            return expect(oneSideAgreementContract.Certify({"from" : accounts[5]})).to.be.eventually.rejected;
        })*/

        it("Deny not by notary", function(){
            return oneSideAgreementContract.Deny({"from" : accounts[5]}).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check that in progress", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(true);
            })
        })


        it("Deny by notary", function(){
            return oneSideAgreementContract.Deny({"from" : accounts[2]}).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check if status is 'denied'", function(){
            return oneSideAgreementContract.CheckStatus().then(function(res){
                expect(res.toString()).to.be.equal("Denied");
            })
        })

        it("Check if 'in progress' is false", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(false);
            })
        })

        it("Certify by notary", function(){
            return oneSideAgreementContract.Certify({"from" : accounts[2]}).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Check if status is still 'denied'", function(){
            return oneSideAgreementContract.CheckStatus().then(function(res){
                expect(res.toString()).to.be.equal("Denied");
            })
        })

        it("Check if 'in progress' is still false", function(){
            return oneSideAgreementContract.inProgress().then(function(res){
                expect(res).to.be.equal(false);
            })
        })

        it("Check if 'is cerified' is still false", function(){
            return oneSideAgreementContract.isCertified().then(function(res){
                expect(res).to.be.equal(false);
            })
        })
    })

    describe("Deploy the AgreementFactory smart contract", function(){
        it("Catch the instance of the AgreementFactory contract", function(){
            return AgreementFactory.new(notarHelpersContract.address).then(function(instance){
                agreementFactoryContract = instance;
            })
        })
    })
    
    describe("Create a new agreement", function(){
        it("Check that exists", function(){
            return notarHelpersContract.GetNotarStatus(accounts[2]).then(function(res){
                expect(res).to.be.equal(true);
            })
        })
        
        it("Create agreement", function(){
            return agreementFactoryContract.CreateAgreement(accounts[2], "0x123", [accounts[5], accounts[6]]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Get for notary", function(){
            return agreementFactoryContract.GetAgreements(accounts[2]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Notary has one agreement", function(){
            return agreementFactoryContract.GetAgreements(accounts[2]).then(function(res){
                expect(res.length).to.be.equal(1);
            })
        })

        it("Get for client", function(){
            return agreementFactoryContract.GetAgreements(accounts[0]).then(function(res){
                expect(res).not.to.be.an("error");
            })
        })

        it("Client has one agreement", function(){
            return agreementFactoryContract.GetAgreements(accounts[0]).then(function(res){
                expect(res.length).to.be.equal(1);
            })
        })
    })
})
