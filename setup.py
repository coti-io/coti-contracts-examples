from setuptools import setup, find_namespace_packages

with open("./README.md") as readme:
    long_description = readme.read()

setup(
    name="coti_contracts_examples",
    description="Example smart contracts demonstrating the use of COTI's GC technology, including integrations with MPC, private ERC20, and ERC721 contracts.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    license='Apache2.0',
    author="COTI Development",
    author_email='dev@coti.io',
    url='https://github.com/coti-io/coti-contracts-examples',
    keywords=["coti", "privacy", "ethereum", "blockchain", "web3", "garbled-circuits", "l2", "on-chain-compute"],
    version='1.0.6',
    packages=find_namespace_packages(include=['artifacts.*']),
    include_package_data=True,
    package_data={
        '': ['artifacts/**/*.json'],
    },
    install_requires=[],
)
