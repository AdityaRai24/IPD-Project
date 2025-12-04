# Deployment Guide

This project consists of a Next.js frontend and a Flask backend. We will deploy the frontend to **Vercel** and the backend to **Render**.

## Prerequisites

- GitHub account
- Vercel account
- Render account

## Part 1: Deploy Backend to Render

1.  **Push your code to GitHub**.
2.  Log in to [Render](https://render.com/).
3.  Click **New +** and select **Web Service**.
4.  Connect your GitHub repository.
5.  Configure the service:
    -   **Name**: `ipd-backend` (or similar)
    -   **Runtime**: `Python 3`
    -   **Build Command**: `pip install -r requirements.txt`
    -   **Start Command**: `gunicorn --worker-class eventlet -w 1 backend.server:app`
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. Copy the **Service URL** (e.g., `https://ipd-backend.onrender.com`).

## Part 2: Deploy Frontend to Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    -   **Framework Preset**: `Next.js` (should be auto-detected)
    -   **Environment Variables**:
        -   Key: `NEXT_PUBLIC_BACKEND_URL`
        -   Value: The **Service URL** from Render (e.g., `https://ipd-backend.onrender.com`)
            -   *Note: Do not add a trailing slash.*
5.  Click **Deploy**.

## Troubleshooting

-   **CORS Issues**: If you see CORS errors in the browser console, ensure the backend URL in Vercel environment variables matches the Render URL exactly.
-   **Socket Connection**: If the video analysis doesn't start, check the browser console for connection errors. Ensure the backend is running and accessible.
-   **OpenCV Errors**: If the backend fails to start on Render with OpenCV errors, ensure `requirements.txt` uses `opencv-python-headless` (already configured).
