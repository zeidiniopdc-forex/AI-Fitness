package com.aifitness.coach

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "NotificationPlugin")
class NotificationPlugin : Plugin() {

    @PluginMethod
    fun scheduleLocal(call: PluginCall) {
        val title = call.getString("title", "یادآوری تمرین")
        val body = call.getString("body", "وقت تمرین است!")
        val id = call.getInt("id", 1)

        // Notification scheduling would be implemented here
        val result = JSObject()
        result.put("scheduled", true)
        result.put("id", id)
        result.put("title", title)
        call.resolve(result)
    }
}
