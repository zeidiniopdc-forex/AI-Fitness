package com.aifitness.coach

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Register plugins if needed
        registerPlugin(NotificationPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
