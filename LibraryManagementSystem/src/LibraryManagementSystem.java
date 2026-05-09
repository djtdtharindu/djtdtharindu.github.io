import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Book {
    private String title;
    private String author;
    private boolean isAvailable;

    public Book(String title, String author) {
        this.title = title;
        this.author = author;
        this.isAvailable = true;
    }

    public String getTitle() { return title; }
    public boolean isAvailable() { return isAvailable; }

    public void borrow() { this.isAvailable = false; }
    public void returnBook() { this.isAvailable = true; }

    @Override
    public String toString() {
        return title + " by " + author + " | Status: " + (isAvailable ? "Available" : "Borrowed");
    }
}

class Library {
    private List<Book> collection;

    public Library() {
        collection = new ArrayList<>();
        // Mock data
        collection.add(new Book("Java Programming", "John Doe"));
        collection.add(new Book("Clean Code", "Robert C. Martin"));
        collection.add(new Book("Design Patterns", "Gang of Four"));
    }

    public void displayBooks() {
        System.out.println("\n--- Library Collection ---");
        for (int i = 0; i < collection.size(); i++) {
            System.out.println((i + 1) + ". " + collection.get(i).toString());
        }
        System.out.println("--------------------------");
    }

    public void borrowBook(int index) {
        if (index >= 0 && index < collection.size()) {
            Book b = collection.get(index);
            if (b.isAvailable()) {
                b.borrow();
                System.out.println(">> Successfully borrowed: " + b.getTitle());
            } else {
                System.out.println(">> Sorry, this book is currently unavailable.");
            }
        } else {
            System.out.println(">> Invalid book selection.");
        }
    }

    public void returnBook(int index) {
        if (index >= 0 && index < collection.size()) {
            Book b = collection.get(index);
            if (!b.isAvailable()) {
                b.returnBook();
                System.out.println(">> Successfully returned: " + b.getTitle());
            } else {
                System.out.println(">> This book was not borrowed.");
            }
        } else {
            System.out.println(">> Invalid book selection.");
        }
    }
}

public class LibraryManagementSystem {
    public static void main(String[] args) {
        Library library = new Library();
        Scanner scanner = new Scanner(System.in);

        System.out.println("==========================================");
        System.out.println("        LIBRARY MANAGEMENT SYSTEM         ");
        System.out.println("==========================================");

        while (true) {
            library.displayBooks();
            System.out.println("1. Borrow a Book");
            System.out.println("2. Return a Book");
            System.out.println("3. Exit");
            System.out.print("Select an option: ");
            
            int choice = scanner.nextInt();
            if (choice == 3) break;

            System.out.print("Enter book number: ");
            int bookNum = scanner.nextInt() - 1;

            if (choice == 1) {
                library.borrowBook(bookNum);
            } else if (choice == 2) {
                library.returnBook(bookNum);
            }
        }
        
        System.out.println("Exiting Library System. Goodbye!");
        scanner.close();
    }
}
