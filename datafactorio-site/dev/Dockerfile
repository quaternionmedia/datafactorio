FROM tiangolo/uvicorn-gunicorn:python3.11 

# Expose the port that the FastAPI application is listening on
EXPOSE 8000

# Prevent Python from generating .pyc files and buffering output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy the contents of the graphbase directory into the /app directory in the container
COPY graphbase /app/graphbase
COPY datafactorio_api.py /app
COPY setup.py /app

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
        python -m pip install -e graphbase/

# Set the PYTHONPATH environment variable to include /app
ENV PYTHONPATH=/app

# Start the FastAPI application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--timeout", "120", "-k", "uvicorn.workers.UvicornWorker", "datafactorio_api:app"]

