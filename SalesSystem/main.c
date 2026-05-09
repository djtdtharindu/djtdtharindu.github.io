#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAX_ITEMS 100
#define MAX_SALES 1000
#define FILE_INVENTORY "inventory.dat"
#define FILE_SALES "sales_log.txt"

// Data Structures
typedef struct {
    int id;
    char name[50];
    int quantity;
    float price;
} Item;

typedef struct {
    int sale_id;
    int item_id;
    char item_name[50];
    int quantity_sold;
    float total_amount;
    char timestamp[30];
} SaleRecord;

// Global Variables
Item inventory[MAX_ITEMS];
int item_count = 0;

SaleRecord sales[MAX_SALES];
int sales_count = 0;

// Function Prototypes
void load_data();
void save_data();
void display_menu();
void view_inventory();
void load_stock();
void record_sale();
void view_sales();
void get_current_time(char* buffer);

int main() {
    // Load existing data from file if available
    load_data();
    
    int choice;
    do {
        display_menu();
        printf("Enter your choice: ");
        if (scanf("%d", &choice) != 1) {
            // Clear buffer on invalid input
            while (getchar() != '\n'); 
            printf("Invalid input. Please enter a number.\n");
            continue;
        }
        
        switch(choice) {
            case 1: view_inventory(); break;
            case 2: load_stock(); break;
            case 3: record_sale(); break;
            case 4: view_sales(); break;
            case 5: 
                save_data();
                printf("Data saved successfully. Exiting system...\n");
                break;
            default:
                printf("Invalid choice. Please select from 1-5.\n");
        }
    } while (choice != 5);
    
    return 0;
}

// ---------------------------------------------------------
// Implementations
// ---------------------------------------------------------

void load_data() {
    FILE *fp = fopen(FILE_INVENTORY, "rb");
    if (fp != NULL) {
        fread(&item_count, sizeof(int), 1, fp);
        fread(inventory, sizeof(Item), item_count, fp);
        fclose(fp);
    }
    
    FILE *fs = fopen("sales_data.dat", "rb");
    if (fs != NULL) {
        fread(&sales_count, sizeof(int), 1, fs);
        fread(sales, sizeof(SaleRecord), sales_count, fs);
        fclose(fs);
    }
}

void save_data() {
    // Save Inventory
    FILE *fp = fopen(FILE_INVENTORY, "wb");
    if (fp != NULL) {
        fwrite(&item_count, sizeof(int), 1, fp);
        fwrite(inventory, sizeof(Item), item_count, fp);
        fclose(fp);
    }
    
    // Save Sales Data (Binary for system)
    FILE *fs = fopen("sales_data.dat", "wb");
    if (fs != NULL) {
        fwrite(&sales_count, sizeof(int), 1, fs);
        fwrite(sales, sizeof(SaleRecord), sales_count, fs);
        fclose(fs);
    }
    
    // Export Human-Readable Sales Log
    FILE *ft = fopen(FILE_SALES, "w");
    if (ft != NULL) {
        fprintf(ft, "========================================\n");
        fprintf(ft, "           SYSTEM SALES LOG             \n");
        fprintf(ft, "========================================\n\n");
        float grand_total = 0;
        for (int i=0; i<sales_count; i++) {
            fprintf(ft, "[%s] Sale ID: %d | Item: %s (ID: %d) | Qty: %d | Total: LKR %.2f\n",
                sales[i].timestamp, sales[i].sale_id, sales[i].item_name, sales[i].item_id, sales[i].quantity_sold, sales[i].total_amount);
            grand_total += sales[i].total_amount;
        }
        fprintf(ft, "\n----------------------------------------\n");
        fprintf(ft, "GRAND TOTAL REVENUE: LKR %.2f\n", grand_total);
        fclose(ft);
    }
}

void display_menu() {
    printf("\n========================================\n");
    printf("        SALES MANAGEMENT SYSTEM         \n");
    printf("========================================\n");
    printf(" 1. View Inventory Stock\n");
    printf(" 2. Load Stock (Add New/Update Quantity)\n");
    printf(" 3. Record Sale (Unload & Checkout)\n");
    printf(" 4. View Sales Records\n");
    printf(" 5. Save & Exit\n");
    printf("========================================\n");
}

void view_inventory() {
    printf("\n--- CURRENT INVENTORY ---\n");
    if (item_count == 0) {
        printf("Inventory is empty.\n");
        return;
    }
    printf("%-5s | %-20s | %-8s | %-12s\n", "ID", "Product Name", "Quantity", "Price (LKR)");
    printf("------------------------------------------------------\n");
    for (int i = 0; i < item_count; i++) {
        printf("%-5d | %-20s | %-8d | %-12.2f\n", 
            inventory[i].id, inventory[i].name, inventory[i].quantity, inventory[i].price);
    }
}

void load_stock() {
    int id, qty, found = 0;
    float price;
    char name[50];
    
    printf("\n--- LOAD INVENTORY STOCK ---\n");
    printf("Enter Product ID: ");
    if(scanf("%d", &id) != 1) {
        while (getchar() != '\n'); 
        return;
    }
    
    for (int i = 0; i < item_count; i++) {
        if (inventory[i].id == id) {
            printf("Found existing item: %s (Current Qty: %d)\n", inventory[i].name, inventory[i].quantity);
            printf("Enter quantity to add to stock: ");
            scanf("%d", &qty);
            inventory[i].quantity += qty;
            
            printf("Update price? (Current: LKR %.2f)\n", inventory[i].price);
            printf("Enter new price, or 0 to keep current: ");
            scanf("%f", &price);
            if (price > 0) inventory[i].price = price;
            
            printf(">> Stock updated successfully!\n");
            found = 1;
            break;
        }
    }
    
    if (!found) {
        if (item_count >= MAX_ITEMS) {
            printf("Error: Inventory is full! Cannot add new product lines.\n");
            return;
        }
        printf("Item not found. Registering as new product...\n");
        inventory[item_count].id = id;
        
        printf("Enter Product Name: ");
        scanf(" %[^\n]", name); // read string with spaces
        strcpy(inventory[item_count].name, name);
        
        printf("Enter Initial Quantity: ");
        scanf("%d", &qty);
        inventory[item_count].quantity = qty;
        
        printf("Enter Price per unit (LKR): ");
        scanf("%f", &price);
        inventory[item_count].price = price;
        
        item_count++;
        printf(">> New product registered and added to inventory.\n");
    }
}

void get_current_time(char* buffer) {
    time_t rawtime;
    struct tm * timeinfo;
    time(&rawtime);
    timeinfo = localtime(&rawtime);
    strftime(buffer, 30, "%Y-%m-%d %H:%M:%S", timeinfo);
}

void record_sale() {
    int id, qty;
    printf("\n--- RECORD SALE / UNLOAD STOCK ---\n");
    printf("Enter Product ID to sell: ");
    if(scanf("%d", &id) != 1) {
        while (getchar() != '\n');
        return;
    }
    
    for (int i = 0; i < item_count; i++) {
        if (inventory[i].id == id) {
            printf("Product: %s | Available Qty: %d | Price: LKR %.2f\n", 
                   inventory[i].name, inventory[i].quantity, inventory[i].price);
            printf("Enter quantity to sell/unload: ");
            scanf("%d", &qty);
            
            if (qty <= 0) {
                printf("Invalid quantity.\n");
                return;
            }
            if (qty > inventory[i].quantity) {
                printf("Error: Insufficient stock in inventory!\n");
                return;
            }
            
            // Process the Sale
            inventory[i].quantity -= qty;
            float total = qty * inventory[i].price;
            
            if (sales_count < MAX_SALES) {
                sales[sales_count].sale_id = sales_count + 1;
                sales[sales_count].item_id = id;
                strcpy(sales[sales_count].item_name, inventory[i].name);
                sales[sales_count].quantity_sold = qty;
                sales[sales_count].total_amount = total;
                get_current_time(sales[sales_count].timestamp);
                sales_count++;
            }
            
            printf(">> Sale successfully recorded! Total Amount: LKR %.2f\n", total);
            return;
        }
    }
    printf("Error: Product ID not found in inventory.\n");
}

void view_sales() {
    printf("\n--- SALES HISTORY ---\n");
    if (sales_count == 0) {
        printf("No sales recorded yet.\n");
        return;
    }
    printf("%-8s | %-20s | %-10s | %-10s | %-15s\n", "Sale ID", "Date & Time", "Item ID", "Qty Sold", "Total (LKR)");
    printf("-----------------------------------------------------------------------\n");
    float grand_total = 0;
    for (int i = 0; i < sales_count; i++) {
        printf("%-8d | %-20s | %-10d | %-10d | %-15.2f\n", 
               sales[i].sale_id, sales[i].timestamp, sales[i].item_id, sales[i].quantity_sold, sales[i].total_amount);
        grand_total += sales[i].total_amount;
    }
    printf("-----------------------------------------------------------------------\n");
    printf("Total Revenue Accumulated: LKR %.2f\n", grand_total);
}
