import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// Interface for all sensors
interface Sensor {
    String getName();
    double readValue();
    boolean isNormal();
}

// Concrete Sensor: PH Sensor
class PHSensor implements Sensor {
    private Random rand = new Random();

    @Override
    public String getName() { return "pH Sensor"; }

    @Override
    public double readValue() {
        // Simulate reading between 5.0 and 8.0
        return 5.0 + (3.0 * rand.nextDouble());
    }

    @Override
    public boolean isNormal() {
        double val = readValue();
        return val >= 5.5 && val <= 6.5; // Ideal pH for hydroponics
    }
}

// Concrete Sensor: Water Level Sensor
class WaterLevelSensor implements Sensor {
    private Random rand = new Random();

    @Override
    public String getName() { return "Water Level Sensor"; }

    @Override
    public double readValue() {
        // Simulate reading percentage 0-100%
        return rand.nextDouble() * 100;
    }

    @Override
    public boolean isNormal() {
        return readValue() > 20.0; // Alert if water level < 20%
    }
}

// Controller Class demonstrating OOP
class HydroponicController {
    private List<Sensor> sensors;

    public HydroponicController() {
        sensors = new ArrayList<>();
        sensors.add(new PHSensor());
        sensors.add(new WaterLevelSensor());
    }

    public void monitorSystem() {
        System.out.println("\n--- Starting Sensor Diagnostics ---");
        for (Sensor sensor : sensors) {
            double val = sensor.readValue();
            System.out.printf("[%s] Reading: %.2f\n", sensor.getName(), val);
            
            if (!sensor.isNormal()) {
                triggerAlert(sensor);
            }
        }
        System.out.println("--- Diagnostics Complete ---\n");
    }

    private void triggerAlert(Sensor sensor) {
        System.out.println(">> ALERT: " + sensor.getName() + " detected abnormal levels!");
        System.out.println(">> Automatically activating corrective pumps/valves...");
    }
}

public class HydroponicFarming {
    public static void main(String[] args) {
        System.out.println("==========================================");
        System.out.println(" HYDROPONIC FARMING SENSOR MONITOR SYSTEM ");
        System.out.println("==========================================");

        HydroponicController controller = new HydroponicController();
        
        // Simulate monitoring over 3 cycles
        for (int i = 1; i <= 3; i++) {
            System.out.println("Cycle " + i + ":");
            controller.monitorSystem();
            try {
                Thread.sleep(1500); // 1.5 second delay between reads
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
