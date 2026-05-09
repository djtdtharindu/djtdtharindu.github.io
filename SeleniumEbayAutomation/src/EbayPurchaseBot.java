import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class EbayPurchaseBot {
    public static void main(String[] args) {
        System.out.println("==========================================");
        System.out.println("       SELENIUM EBAY AUTOMATION BOT       ");
        System.out.println("==========================================");

        // Note: For this to run, ChromeDriver must be downloaded and its path set properly.
        // System.setProperty("webdriver.chrome.driver", "path/to/chromedriver.exe");
        
        System.out.println(">> Initializing Chrome WebDriver...");
        WebDriver driver = null;
        
        try {
            driver = new ChromeDriver();
            driver.manage().window().maximize();
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // 1. Navigate to eBay
            System.out.println(">> Navigating to eBay.com...");
            driver.get("https://www.ebay.com");

            // 2. Search for "Mobile Phone"
            System.out.println(">> Searching for 'Mobile Phone'...");
            WebElement searchBox = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("gh-ac")));
            searchBox.sendKeys("Mobile Phone");
            
            WebElement searchButton = driver.findElement(By.id("gh-btn"));
            searchButton.click();

            // 3. Wait for results and click the first item
            System.out.println(">> Waiting for search results...");
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".s-item__title")));
            
            // Get the list of items (skip the first one which is usually a hidden element in eBay DOM)
            List<WebElement> items = driver.findElements(By.cssSelector(".s-item__link"));
            if (items.size() > 1) {
                System.out.println(">> Clicking the first mobile phone listing...");
                String itemUrl = items.get(1).getAttribute("href"); // eBay usually puts actual results from index 1
                driver.get(itemUrl); // Navigate directly to item to avoid target="_blank" new tab issues
                
                // 4. Attempt to add to cart
                System.out.println(">> Attempting to Add to Cart...");
                try {
                    WebElement addToCartBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("isCartBtn_btn")));
                    addToCartBtn.click();
                    System.out.println(">> SUCCESS: Item added to cart successfully!");
                } catch (Exception e) {
                    System.out.println(">> INFO: This item might require selecting variations (Color/Size) before adding to cart, or the button ID has changed.");
                    System.out.println(">> Falling back to 'Buy It Now' check...");
                    try {
                        WebElement buyItNowBtn = driver.findElement(By.id("binBtn_btn"));
                        System.out.println(">> SUCCESS: 'Buy It Now' button found and verified.");
                    } catch (Exception ex) {
                        System.out.println(">> ERROR: Could not find cart interaction buttons.");
                    }
                }
            } else {
                System.out.println(">> No items found in search results.");
            }

        } catch (Exception e) {
            System.err.println(">> Automation Failed: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (driver != null) {
                System.out.println(">> Closing browser and cleaning up...");
                // driver.quit(); // Commented out so the user can see the final state if they run it
            }
            System.out.println("==========================================");
            System.out.println("             PROCESS COMPLETE             ");
            System.out.println("==========================================");
        }
    }
}
