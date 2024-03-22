from setuptools import setup

setup(
    name="datafactorio-api",
    version="0.1",
    description="A simple api for testing",
    author="Quaternion Media",
    author_email="cameron.west@quaternionmedia.com",
    install_requires=["networkx", "pymongo", "fastapi", "pytest", "uvicorn"],
)
