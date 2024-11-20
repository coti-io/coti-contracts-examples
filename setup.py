from setuptools import setup, find_namespace_packages

setup(
    name="coti_contracts_examples",
    version='0.1.0',
    packages=find_namespace_packages(include=['artifacts.*']),
    include_package_data=True,
    package_data={
        '': ['artifacts/**/*.json'],
    },
    install_requires=[],
)
