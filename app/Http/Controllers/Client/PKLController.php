<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PKLController extends Controller
{
    /**
     * Display a listing of PKL programs for the client.
     */
    public function index(): Response
    {
        return Inertia::render('client/pkl/index');
    }

    /**
     * Display the specified PKL program detail.
     */
    public function show(string $id): Response
    {
        // In a real application, you would fetch the PKL data from the database
        // For now, we'll use sample data
        $pkl = [
            'id' => $id,
            'nama' => 'PKL lorem ipsum dolor sit amet',
            'deskripsi' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        ];

        return Inertia::render('client/pkl/detail', [
            'pkl' => $pkl
        ]);
    }

    /**
     * Handle document upload for PKL program.
     */
    public function uploadDocument(Request $request, string $id)
    {
        $request->validate([
            'jenis_dokumen' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        // Handle file upload logic here
        // This is where you would save the file and create database records
        
        return redirect()->back()->with('success', 'Dokumen berhasil diunggah!');
    }
}
