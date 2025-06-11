# Troubleshooting MongoDB Connection Issues

This guide will help you troubleshoot MongoDB connection issues with the Blog Platform API, especially when deployed on Vercel.

## Common Issues and Solutions

### 1. "Database connection failed" Error

**Symptoms:**
- API returns 503 status code with "Database connection failed" message
- Login and other database operations fail

**Possible Causes:**
- MongoDB Atlas IP access restrictions
- MongoDB connection string issues
- Vercel environment variables not properly set
- MongoDB Atlas cluster might be in a different region than your Vercel deployment

**Solutions:**

1. **Check MongoDB Atlas IP Access:**
   - Go to MongoDB Atlas dashboard
   - Navigate to Network Access
   - Add `0.0.0.0/0` to allow access from anywhere (for testing)
   - For production, consider using more restrictive IP ranges

2. **Verify MongoDB Connection String:**
   - Check that your connection string is correctly formatted
   - Ensure username and password are URL-encoded
   - Make sure the database name is correct

3. **Check Vercel Environment Variables:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Verify that `MONGODB_URI` is set correctly
   - Redeploy after making changes

4. **Region Optimization:**
   - Deploy your MongoDB Atlas cluster in the same region as your Vercel deployment
   - For Vercel, check deployment region in project settings
   - For MongoDB Atlas, create a cluster in the matching region

### 2. "Operation buffering timed out" Error

**Symptoms:**
- API returns 504 status code
- Error message contains "buffering timed out after X ms"

**Solutions:**

1. **Increase Timeout Values:**
   - The application already has increased timeout values (60 seconds)
   - If still experiencing issues, consider further increases

2. **Optimize Database Queries:**
   - Add pagination to large result sets
   - Add proper indexes to frequently queried fields
   - Limit the fields returned in queries

3. **Upgrade MongoDB Atlas Tier:**
   - Consider upgrading from shared to dedicated clusters for better performance

## Diagnostic Tools

The API includes several diagnostic endpoints to help troubleshoot issues:

1. **Web Interface:** `/diagnostic`
   - A user-friendly interface for testing API and database connections

2. **API Status:** `/health`
   - Returns basic API health information

3. **Database Health:** `/db-health`
   - Returns detailed database connection status
   - Attempts to reconnect if disconnected

4. **Environment Check:** `/env-check`
   - Returns environment information without requiring database connection

5. **Detailed Diagnostics:** `/api/diagnostic/status`
   - Returns comprehensive system status information

6. **Force Database Reconnect:** `/api/diagnostic/db-reconnect`
   - Forces a database reconnection attempt

## Vercel-Specific Troubleshooting

1. **Cold Starts:**
   - Serverless functions on Vercel have "cold starts" which can affect database connections
   - The first request after inactivity may be slow or fail
   - Subsequent requests should be faster as the connection is cached

2. **Function Timeout:**
   - Vercel has a maximum execution time for serverless functions (10-60 seconds)
   - If your database operations take longer, they may time out
   - Consider optimizing queries or using pagination

3. **Environment Variables:**
   - Vercel requires environment variables to be set in the Vercel dashboard
   - Changes to environment variables require redeployment

4. **Logs:**
   - Check Vercel logs for detailed error information
   - Navigate to your project dashboard > Deployments > Select deployment > Functions > View logs

## Contact Support

If you continue to experience issues after trying these solutions, please contact support with:

1. The specific error message you're receiving
2. Results from the diagnostic endpoints
3. Your Vercel deployment URL
4. Any recent changes made to the application or database