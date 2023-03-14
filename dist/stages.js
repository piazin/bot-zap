"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stages = void 0;
const _index_1 = require("./stages/_index");
exports.stages = [
    {
        description: 'Welcome to User',
        stage: _index_1.Welcome,
    },
    {
        description: 'Talk to an attendant',
        stage: _index_1.TalkOrNewCall,
    },
    {
        description: 'Send Image or No',
        stage: _index_1.ReceiveImageWithTheProblem,
    },
    {
        description: 'Select Attendant',
        stage: _index_1.SendAttendantList,
    },
    {
        description: 'Send Message to Attendant',
        stage: _index_1.SendMessageToAttendant,
    },
    {
        description: 'Request User Email',
        stage: _index_1.RequestUserEmail,
    },
    {
        description: 'Open New Ticket',
        stage: _index_1.OpenNewTicket,
    },
    {
        description: 'Chat with GPT3',
        stage: _index_1.ChatWithGPT3,
    },
    {
        description: 'Generate image by IA',
        stage: _index_1.GenerateImageByGPT3,
    },
];
