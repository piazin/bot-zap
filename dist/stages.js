"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stages = void 0;
const _index_1 = require("./stages/_index");
exports.stages = [
    {
        description: 'Welcome to User',
        stage: _index_1.welcome,
    },
    {
        description: 'Talk to an attendant',
        stage: _index_1.talkOrNewCall,
    },
    {
        description: 'Send Image or No',
        stage: _index_1.receiveImageWithTheProblem,
    },
    {
        description: 'Select Attendant',
        stage: _index_1.sendAttendantList,
    },
    {
        description: 'Send Message to Attendant',
        stage: _index_1.sendMessageToAttendant,
    },
    {
        description: 'Request User Email',
        stage: _index_1.requestUserEmail,
    },
    {
        description: 'Open New Ticket',
        stage: _index_1.openNewTicket,
    },
    {
        description: 'Chat with GPT3',
        stage: _index_1.chatWithGPT3,
    },
    {
        description: 'Generate image by IA',
        stage: _index_1.generateImageByGPT3,
    },
];
