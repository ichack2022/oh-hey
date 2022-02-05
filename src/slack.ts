import Messager from "./messager";

class SlackMessag implements Messager {
    
    poll(): boolean {
        throw new Error("Method not implemented.");
    }
    send(): void {
        throw new Error("Method not implemented.");
    }
    get(): string {
        throw new Error("Method not implemented.");
    }

}