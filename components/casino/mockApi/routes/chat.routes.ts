
import * as controller from '../controllers/chat.controller';

export const getHistory = () => controller.getHistory();
export const sendMessage = (text: string) => controller.sendMessage(text);
