<script>
  const password = prompt("Enter wholesale password:");
  if(password !== "YOUR_PASSWORD") {
    alert("Access denied");
    window.location = "https://google.com"; // or any page
  }
</script>
