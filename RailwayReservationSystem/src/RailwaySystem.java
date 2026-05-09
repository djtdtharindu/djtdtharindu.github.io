import java.sql.*;
import java.util.Scanner;

public class RailwaySystem {
    // Database configuration
    private static final String DB_URL = "jdbc:mysql://localhost:3306/railway_db";
    private static final String USER = "root";
    private static final String PASS = "password";

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  ONLINE RAILWAY RESERVATION SYSTEM     ");
        System.out.println("========================================");

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Scanner scanner = new Scanner(System.in)) {
             
            System.out.println(">> Database connected successfully!");
            
            while(true) {
                System.out.println("\n1. View Available Trains");
                System.out.println("2. Book a Ticket");
                System.out.println("3. Cancel Ticket");
                System.out.println("4. Exit");
                System.out.print("Enter choice: ");
                
                int choice = scanner.nextInt();
                if(choice == 4) break;
                
                switch(choice) {
                    case 1:
                        viewTrains(conn);
                        break;
                    case 2:
                        bookTicket(conn, scanner);
                        break;
                    case 3:
                        cancelTicket(conn, scanner);
                        break;
                    default:
                        System.out.println("Invalid choice.");
                }
            }
        } catch (SQLException e) {
            System.err.println("Database connection failed. Ensure MySQL is running and credentials are correct.");
            System.err.println("Error: " + e.getMessage());
            System.out.println("\n[MOCK MODE] - Simulating system without database...");
            // Fallback mock logic could go here for demonstration
        }
    }

    private static void viewTrains(Connection conn) throws SQLException {
        String query = "SELECT * FROM trains WHERE available_seats > 0";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
             
            System.out.println("\n--- Available Trains ---");
            while (rs.next()) {
                System.out.printf("Train ID: %d | Name: %s | Source: %s | Dest: %s | Seats: %d\n",
                    rs.getInt("train_id"), rs.getString("train_name"), 
                    rs.getString("source"), rs.getString("destination"), 
                    rs.getInt("available_seats"));
            }
        }
    }

    private static void bookTicket(Connection conn, Scanner scanner) throws SQLException {
        System.out.print("Enter Train ID: ");
        int trainId = scanner.nextInt();
        System.out.print("Enter Passenger Name: ");
        scanner.nextLine(); // consume newline
        String name = scanner.nextLine();
        
        conn.setAutoCommit(false); // Start transaction
        try {
            // Check availability
            String checkQuery = "SELECT available_seats FROM trains WHERE train_id = ? FOR UPDATE";
            try (PreparedStatement checkStmt = conn.prepareStatement(checkQuery)) {
                checkStmt.setInt(1, trainId);
                ResultSet rs = checkStmt.executeQuery();
                if (rs.next() && rs.getInt("available_seats") > 0) {
                    // Update seats
                    String updateQuery = "UPDATE trains SET available_seats = available_seats - 1 WHERE train_id = ?";
                    try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                        updateStmt.setInt(1, trainId);
                        updateStmt.executeUpdate();
                    }
                    
                    // Insert booking
                    String bookQuery = "INSERT INTO bookings (train_id, passenger_name) VALUES (?, ?)";
                    try (PreparedStatement bookStmt = conn.prepareStatement(bookQuery)) {
                        bookStmt.setInt(1, trainId);
                        bookStmt.setString(2, name);
                        bookStmt.executeUpdate();
                    }
                    
                    conn.commit();
                    System.out.println(">> Ticket booked successfully for " + name);
                } else {
                    System.out.println(">> Sorry, no seats available on this train.");
                    conn.rollback();
                }
            }
        } catch (SQLException e) {
            conn.rollback();
            throw e;
        } finally {
            conn.setAutoCommit(true);
        }
    }

    private static void cancelTicket(Connection conn, Scanner scanner) throws SQLException {
        System.out.print("Enter Booking ID to cancel: ");
        int bookingId = scanner.nextInt();
        
        // Cancellation logic utilizing transactions...
        System.out.println(">> Ticket cancellation requested for Booking ID: " + bookingId);
        // ...
    }
}
