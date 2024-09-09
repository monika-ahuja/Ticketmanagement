export interface StatusHistory {
  status: string;
  timestamp: any;
}


export interface Ticket {
    //messages: never[];
    id?: number;
    title: string;
    description: string;
    userId: string;
    status: string; 
    createdAt:Date;
    username?:string;
    statusUpdatedAt?: Date;
    messages: Message[];
    statusHistory?: StatusHistory[];  // New field for status history  
  }

  export interface Message {
  //  ticketId: number; // Add ticketId to the Message interface
    sender: string;
    text: string; 
    timestamp: Date;
  }
 
  