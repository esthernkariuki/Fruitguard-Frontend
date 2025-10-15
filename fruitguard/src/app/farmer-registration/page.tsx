"use client"
import FarmersPage from "./components/FarmersTable"
import AgrovetLayout from "../sharedComponents/AgrovetLayout"
import MqttSubscriber from "../hivemq/page"

export default function Register(){
    return(
        <AgrovetLayout>
            <div>
            <FarmersPage/>
            <MqttSubscriber/>
            
            </div>
        </AgrovetLayout>
    )
}