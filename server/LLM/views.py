from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from langchain.llms import Ollama
from langchain.chains import RetrievalQA
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

class QueryView(APIView):

    def post(self, request):
        query = request.data.get("query", "")
        if not query:
            return Response({"error": "Query not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            os.environ['PINECONE_API_KEY'] = '39c3b55b-2ae4-44ee-a9cd-83a99876c828'
            llm = Ollama(model='llama3')
            embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            index_name = "recipe"
            vectorstore = PineconeVectorStore(
                index_name=index_name,
                embedding=embeddings_model,
                namespace="real"
            )

            retrieval_qa = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=vectorstore.as_retriever()
            )

            answer = retrieval_qa.run(query)
            return Response({"answer": answer}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
