import {Inbox} from 'lucide-react';export default function Empty({text='Nothing here yet'}){return <div className="empty"><div className="empty-icon"><Inbox size={20}/></div><div>{text}</div></div>}
