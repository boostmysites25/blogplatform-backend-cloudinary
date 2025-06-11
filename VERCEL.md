# Deploying to Vercel

This guide provides specific instructions for deploying the Blog Platform API to Vercel.

## Prerequisites

1. A Vercel account
2. A MongoDB Atlas account with a cluster set up
3. The Vercel CLI installed (optional, for local testing)

## Environment Variables

Set the following environment variables in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string **without** the database name | `mongodb+srv://username:password@cluster.mongodb.net` |
| `JWT_SECRET` | Secret key for JWT token generation | `your-secure-secret-key` |
| `NODE_ENV` | Environment setting | `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

## Important Notes for MongoDB Connection

1. **Do not include the database name in your MongoDB URI**
   - Correct: `mongodb+srv://username:password@cluster.mongodb.net`
   - Incorrect: `mongodb+srv://username:password@cluster.mongodb.net/blog-platform`
   - The database name is set in the connection options in the code

2. **MongoDB Atlas Configuration**
   - Ensure your MongoDB Atlas cluster allows connections from all IP addresses (0.0.0.0/0)
   - Create a dedicated database user with appropriate permissions
   - Choose a MongoDB Atlas tier appropriate for your expected traffic

3. **Region Optimization**
   - Deploy your MongoDB Atlas cluster in the same region as your Vercel deployment
   - For Vercel, you can set the deployment region in project settings

## Deployment Steps

### Using Vercel Dashboard

1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Build Command: `npm run vercel-build`
   - Output Directory: Leave empty
   - Install Command: `npm install`
3. Add all environment variables
4. Deploy

### Using Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy from the project directory:
   ```
   vercel
   ```

4. Follow the prompts to configure your project

## Troubleshooting

If you encounter MongoDB connection issues:

1. Visit the diagnostic page: `https://your-vercel-app.vercel.app/diagnostic`
2. Use the "Test Connection" button to check basic connectivity
3. Check the MongoDB Atlas logs for connection attempts
4. Verify that your environment variables are set correctly
5. Check that your MongoDB Atlas user has the correct permissions

## Monitoring

1. Use Vercel's built-in logs to monitor your application
2. Set up MongoDB Atlas monitoring for database performance
3. Consider implementing a third-party monitoring solution for production deployments

## Scaling

1. Upgrade your MongoDB Atlas tier as needed
2. Consider using MongoDB Atlas connection pooling for high-traffic applications
3. Implement caching for frequently accessed data